import { Sidekick } from "./sidekick.js";
import { NAME, SETTING_KEYS, FLAGS } from "./butler.js";
import { EnhancedConditions } from "./enhanced-conditions/enhanced-conditions.js";

/**
 * Request a roll or display concentration checks when damage is taken.
 * @author JacobMcAuley
 * @author Evan Clarke
 * @todo Supply DC
 */
export class Concentrator {
    
    /* -------------------------------------------- */
    /*                   Handlers                   */
    /* -------------------------------------------- */

    /**
     * Handle render ChatMessage
     * @param {*} app 
     * @param {*} html 
     * @param {*} data 
     */
    static _onRenderChatMessage(app, html, data) {
        const enableConcentrator = Sidekick.getSetting(SETTING_KEYS.concentrator.enable);

        // Early return if basic conditions not met
        if (!game.user.isGM || !enableConcentrator) return;

        const autoConcentrate = Sidekick.getSetting(SETTING_KEYS.concentrator.autoConcentrate);
        const concentrateFlag = app.getFlag(NAME, FLAGS.concentrator.chatMessage);

        if (!autoConcentrate || concentrateFlag) return;

        const itemDiv = html.find("div[data-item-id]");

        // support Beyond20
        const concentrationDiv = html.find(":contains('Requires Concentration')");

        if (!itemDiv.length && !concentrationDiv.length) return;

        const itemId = itemDiv.data("itemId") || null;

        const messageActorId = app.data.speaker.actor;
        const messageSceneId = app.data.speaker.scene;
        const messageTokenId = app.data.speaker.token;
        const scene = messageSceneId ? game.scenes.get(messageSceneId) : game.scenes.active;
        const tokenData = scene ? scene.data.tokens.find(t => t.id === messageTokenId) : null;
        const token = canvas?.tokens?.get(messageTokenId) ?? (tokenData ? new Token(tokenData, scene) : null);
        const actor = token ? token.actor : messageActorId ? game.actors.get(messageActorId) : null;

        if (!actor) return;

        // First check if the item is a spell
        // note: Beyond20 bypasses this logic
        const item = itemId ? actor.items.get(itemId) : null;
        const isSpell = item ? item.type === "spell" : false;

        // If it is, check if it requires concentration
        const isConcentration = concentrationDiv.length ? true : (isSpell ? !!getProperty(item, `data.data.components.concentration`) : false);

        if (!isConcentration) return;

        const conditionName = Sidekick.getSetting(SETTING_KEYS.concentrator.conditionName);
        const isAlreadyConcentrating = EnhancedConditions.hasCondition(conditionName, actor, {warn: false});
        const notifyDoubleSetting = Sidekick.getSetting(SETTING_KEYS.concentrator.notifyDouble);

        // If the actor/token-actor is already Concentrating, and the notification setting is enabled, fire a notification
        if (isAlreadyConcentrating && notifyDoubleSetting !== "none") {
            Concentrator._notifyDoubleConcentration(actor);
        } else {
            // Otherwise, add the Concentrating condition
            EnhancedConditions.addCondition(conditionName, actor, {warn: false}).then(()=>
            Concentrator._updateConcentrationDuration(actor, item, conditionName,item.uuid)
        );
        }

        // Finally, set a flag that this message has been processed
        return app.setFlag(NAME, FLAGS.concentrator.chatMessage, true);
    }

    /**
     * preUpdateActor Handler
     * @param {*} actor 
     * @param {*} update 
     * @param {*} options 
     * @param {*} userId 
     */
    static _onPreUpdateActor(actor, update, options, userId) {
        const enableConcentrator = Sidekick.getSetting(SETTING_KEYS.concentrator.enable);

        if (!enableConcentrator) return true;

        // Update handled in token hooks
        if (actor.isToken) return true;

        const newHealth = getProperty(update, `data.${Sidekick.getSetting(SETTING_KEYS.concentrator.healthAttribute)}.value`);
        const oldHealth = getProperty(actor, `data.data.${Sidekick.getSetting(SETTING_KEYS.concentrator.healthAttribute)}.value`);

        const damageTaken = Concentrator._wasDamageTaken(newHealth, oldHealth);

        if (damageTaken) {
            options[NAME] = {
                [FLAGS.concentrator.damageTaken]: true,
                [FLAGS.concentrator.damageAmount]: Concentrator._calculateDamage(newHealth, oldHealth),
                [FLAGS.concentrator.isDead]:  newHealth <= 0
            }
        }

        return true;
    }

    /**
     * Update Actor handler
     * @param {*} actor 
     * @param {*} update 
     * @param {*} options 
     */
    static _onUpdateActor(actor, update, options, userId){
        const damageTaken = getProperty(options, `${NAME}.${FLAGS.concentrator.damageTaken}`);

        if (!damageTaken || (!game.user.isGM && userId !== game.userId)) return;

        // Update handled in token hooks
        if (actor.isToken) return;

        return Concentrator._processDamage(actor, options);
    }

    /**
     * preUpdateToken handler
     * @param {*} scene 
     * @param {*} tokenData
     * @param {*} update 
     * @param {*} options 
     */
    static _onPreUpdateToken(token, update, options, userId){
        const enableConcentrator = Sidekick.getSetting(SETTING_KEYS.concentrator.enable);

        if (!enableConcentrator) return true;

        const newHealth = getProperty(update, `actorData.data.${Sidekick.getSetting(SETTING_KEYS.concentrator.healthAttribute)}.value`);
        const oldHealth = getProperty(token, `actor.data.data.${Sidekick.getSetting(SETTING_KEYS.concentrator.healthAttribute)}.value`);
        
        const damageTaken = Concentrator._wasDamageTaken(newHealth, oldHealth);

        if (damageTaken) {
            const cubOption = options[NAME] = options[NAME] ?? {};
            cubOption[FLAGS.concentrator.damageTaken] = true;
            cubOption[FLAGS.concentrator.damageAmount] = Concentrator._calculateDamage(newHealth, oldHealth);
            cubOption[FLAGS.concentrator.isDead] = newHealth <= 0;
        }

        return true;
    }

    /**
     * Update Token handler
     * @param {*} scene 
     * @param {*} token 
     * @param {*} update 
     * @param {*} options 
     * @param {*} userId 
     */
    static _onUpdateToken(token, update, options, userId){
        const damageTaken = getProperty(options, `${NAME}.${FLAGS.concentrator.damageTaken}`);

        if (!damageTaken || (!game.user.isGM && userId !== game.userId)) return;

        return Concentrator._processDamage(token, options);
    }

    /* -------------------------------------------- */
    /*                    Workers                   */
    /* -------------------------------------------- */

    /**
     * Processes a damage event for Concentration purposes
     * @param {*} entity
     * @param {*} options 
     * @returns 
     */
    static _processDamage(entity, options) {
        const isConcentrating = Concentrator._isConcentrating(entity);
        const displayPrompt = Sidekick.getSetting(SETTING_KEYS.concentrator.prompt);
        const outputChat = Sidekick.getSetting(SETTING_KEYS.concentrator.outputChat);

        if (!isConcentrating || (!displayPrompt && !outputChat)) return;

        const damageAmount = getProperty(options, `${NAME}.${FLAGS.concentrator.damageAmount}`);
        const isDead = getProperty(options, `${NAME}.${FLAGS.concentrator.isDead}`);
        const halfDamage = Math.floor(damageAmount / 2);
        const dc = halfDamage > 10 ? halfDamage : 10;

        if (outputChat) {
            if (isDead) return Concentrator._processDeath(entity);

            Concentrator._displayChat(entity, dc);
        }

        if (displayPrompt) {
            return Concentrator._determinePromptedUsers(entity,dc);
        }
    }

    /**
     * Processes the steps necessary when the concentrating token is dead
     * @param {*} entity 
     */
    static async _processDeath(entity) {
        await Concentrator.processFailDC(entity);

        return Concentrator._displayDeathChat(entity);
    }
    /**
     * Processes the steps necessary when the concentrating token failed the save DC.
     * @param {*} entity 
     */
    static async processFailDC(entity){
        const conditionName = Sidekick.getSetting(SETTING_KEYS.concentrator.conditionName);
        const actor = entity instanceof Actor ? entity : (entity instanceof Token || entity instanceof TokenDocument) ? entity.actor : null;
        const concentrationItemUuid=actor.effects.find(x=>x.data.label==conditionName)?.data.flags.concentrator?.ItemUuid;
        const concentrationStartTime=actor.effects.find(x=>x.data.label==conditionName)?.data.duration?.startTime;
        if(concentrationItemUuid){
            await Concentrator._removeDependantEffects(concentrationItemUuid,concentrationStartTime);
        }
        return await EnhancedConditions.removeCondition(conditionName, entity);
    }
    /**
     * Distributes concentration prompts to affected users
     * @param {*} options 
     */
    static _determinePromptedUsers(entity,dc){
        const actorId = entity instanceof Actor ? entity.id : entity.actor.id;
        if (!actorId) return;

        const actor = game.actors.get(actorId);

        if (!actor) return;

        let owners = game.users.entities.filter(user => user.active && actor.hasPerm(user, Sidekick.getKeyByValue(CONST.ENTITY_PERMISSIONS, CONST.ENTITY_PERMISSIONS.OWNER)) && !user.isGM);

        if (!owners.length) {
            const gmUsers = game.users.filter(u => u.active && u.isGM);
            owners = gmUsers;
        }

        const ownerIds = owners.map(u => u.id);

        return Concentrator._distributePrompts(entity, actorId, ownerIds, dc);
    }

    /**
     * Distribute concentration prompts to affected users
     * @param {*} entity 
     * @param {*} users 
     */
    static _distributePrompts(entity, actorId, userIds, dc){
        for (const uId of userIds) {
            Concentrator._displayPrompt(entity, actorId, uId, dc);
        }
    }

    /**
     * Displays the prompt to roll a concentration check
     * @param {*} actorId 
     * @param {*} userId 
     */
    static _displayPrompt(entity, actorId, userId, dc){
        const actor = game.actors.get(actorId);
        const ability = Sidekick.getSetting(SETTING_KEYS.concentrator.concentrationAttribute);

        if (!actor || game.userId !== userId) {
            return;
        }

        new Dialog({
            title: "Concentration Check",
            content: `<p>Roll a concentration check for ${actor.name}?</p>`,
            buttons: {
                yes: {
                    label: "Yes",
                    icon: `<i class="fas fa-check"></i>`,
                    callback: e => {
                        actor.rollAbilitySave(ability).then(result=>{
                            if(result.total>=dc){
                                return;
                            }
                            return Concentrator.processFailDC(entity);
                    });
                    }
                },
                no: {
                    label: "No",
                    icon: `<i class="fas fa-times"></i>`,
                    callback: e => {
                        //maybe whisper the GM to alert them that the player canceled the check?
                    }
                }
            },
            default: "Yes"
        }).render(true);
    }

    /**
     * Displays a chat message for concentration checks
     * @param {*} entity
     * @param {*} dc
     */
    static _displayChat(entity, dc){
        if (!game.user.isGM) return;

        const isActor = entity instanceof Actor;
        const isToken = entity instanceof Token || entity instanceof TokenDocument;
        const user = game.userId;
        const speaker = isActor ? ChatMessage.getSpeaker({actor: entity}) : isToken ? ChatMessage.getSpeaker({token: entity}) : ChatMessage.getSpeaker();
        const content = `<h3>Concentrator</header></h3>${entity.name} took damage and their concentration is being tested (DC${dc})!</p>`;
        const type = CONST.CHAT_MESSAGE_TYPES.OTHER;

        return ChatMessage.create({user, speaker, content, type});
    }

    /**
     * Displays a message when a concentrating token dies
     * @param {*} entity 
     */
    static _displayDeathChat(entity) {
        if (!game.user.isGM) return;

        const isActor = entity instanceof Actor;
        const isToken = entity instanceof Token || entity instanceof TokenDocument;
        const user =  game.userId;
        const speaker = isActor ? ChatMessage.getSpeaker({actor: entity}) : isToken ? ChatMessage.getSpeaker({token: entity}) : ChatMessage.getSpeaker();
        const content = `<h3>Concentrator</header></h3>${entity.name} is incapacitated and the spell they were concentrating on is lost!</p>`;
        const type = CONST.CHAT_MESSAGE_TYPES.OTHER;

        return ChatMessage.create({user, speaker, content, type});
    }

    /**
     * Displays a chat message to GMs if a Concentration spell is cast while already concentrating
     * @param {*} entity  the entity with double concentration
     */
    static _notifyDoubleConcentration(entity) {
        const isWhisper = Sidekick.getSetting(SETTING_KEYS.concentrator.notifyDouble) === "gm";
        const isActor = entity instanceof Actor;
        const isToken = entity instanceof Token || entity instanceof TokenDocument;
        const speaker = isActor ? ChatMessage.getSpeaker({actor: entity}) : isToken ? ChatMessage.getSpeaker({token: entity}) : ChatMessage.getSpeaker();
        const whisper = isWhisper ? game.users.entities.filter(u => u.isGM) : [];
        const content =  `<h3>Concentrator</h3><p>${entity.name} cast a spell requiring Concentration while concentrating on another spell. Concentration on the original spell is lost.`;
        const type = CONST.CHAT_MESSAGE_TYPES.OTHER;

        return ChatMessage.create({speaker, whisper, content, type});
    }
    static async _updateConcentrationDuration(entity,item, conditionName,itemUuid) {
        let effect = entity?.temporaryEffects.find(x=>x.data.label==conditionName)
        await effect.update({duration:{seconds:null, rounds: null, startRound:null,startTime:null,turns:null, startTurn:null}});
        let Spellduration = getProperty(item, `data.data.duration`);
        if(!Spellduration){
         await effect.update({flags:{concentrator:{ItemUuid:itemUuid}}});
         return;
        }
        let durUnit = Spellduration.units;
        let durTime = Spellduration.value;
        switch(durUnit){
             case "minute":
                 durUnit = "seconds"
                 durTime = durTime*60;
                 break;
             case "hour":
                 durUnit = "seconds"
                 durTime = durTime*3600;
                 break;
             case "day":
                 durUnit = "seconds"
                 durTime = durTime*3600*24;
                 break;
             case "month":
                 durUnit = "seconds"
                 durTime = durTime*3600*24*30;
                 break;
             case "year":
                 durUnit = "seconds"
                 durTime = durTime*3600*24*30*365;
             default:
                 durUnit+="s";
                 break;
        }
        switch(durUnit){
            case "seconds":
             case "rounds":
             case "turns":
                 await effect.update({duration:{[durUnit]:durTime,startTime: game.time.worldTime},flags:{concentrator:{ItemUuid:itemUuid}}});
                 break;
             default:
                 break;
        }
     }
     static async _removeDependantEffects(uuid,startTime){
        if(!game.user.isGM){return;}
       const effects = canvas.tokens.placeables.filter(x=>x.actor.temporaryEffects.length>0)?.map(x=>x.actor?.effects)
       if(startTime && startTime>0){
            return await effects.forEach(async eff=>{const effect = eff.find(e=>e.data.origin==uuid && e.data.duration.startTime==startTime);
                if(effect){
                    await effect.parent.deleteEmbeddedEntity("ActiveEffect", effect._id);
                }
            });
       } else{
            return await effects.forEach(async eff=>{const effect = eff.find(e=>e.data.origin==uuid)
                if(effect){
                    await effect.parent.deleteEmbeddedEntity("ActiveEffect", effect._id);
                }
            });
        }
    }


    /* -------------------------------------------- */
    /*                    Helpers                   */
    /* -------------------------------------------- */

    /**
     * Executes when the module setting is enabled
     */
    static _promptEnableEnhancedConditions() {
        const title = "Enable Enhanced Conditions?";
        const content = `<p>In order to use Concentrator you must enable Enhanced Conditions.</p><strong>Would you like to enable Enhanced Conditions</strong>`;
        new Dialog({
            title,
            content,
            buttons: {
                yes: {
                    label: "Yes",
                    icon: `<i class="fas fa-check"></i>`,
                    callback: async e => {
                        await Sidekick.setSetting(SETTING_KEYS.enhancedConditions.enable, true, true);
                        Concentrator._createCondition();
                        ui.settings.render();
                    }
                },
                no: {
                    label: "No",
                    icon: `<i class="fas fa-times"></i>`,
                    callback: e => {
                        //maybe whisper the GM to alert them that the player canceled the check?
                    }
                }
            }
        }).render(true);
    }

    /**
     * Creates a condition for Concentrating if none exists
     * @todo extract to Enhanced Conditions and make it generic
     */
    static _createCondition() {
        const conditionName = Sidekick.getSetting(SETTING_KEYS.concentrator.conditionName);
        const icon = "icons/svg/d20-black.svg";

        const enhancedConditions = Sidekick.getSetting(SETTING_KEYS.enhancedConditions.enable);

        if (!enhancedConditions) {
            return;
        }

        const conditionMap = Sidekick.getSetting(SETTING_KEYS.enhancedConditions.map);

        const concentrating = EnhancedConditions._lookupConditionByName(conditionName);

        if (concentrating) return;

        const update = duplicate(conditionMap);

        update.push({
            name: conditionName,
            icon
        });

        Sidekick.setSetting(SETTING_KEYS.enhancedConditions.map, update);
    }

    /**
     * Determines if health has been reduced 
     * @param {*} newHealth 
     * @param {*} oldHealth 
     * @returns {Boolean}
     */
    static _wasDamageTaken(newHealth, oldHealth) {
        return newHealth < oldHealth || false;
    }

    /**
     * Checks for the presence of the concentration condition effect
     * @param {*} token
     * @returns {Boolean}
     */
    static _isConcentrating(token) {
        const conditionName = Sidekick.getSetting(SETTING_KEYS.concentrator.conditionName);
        const _isConcentrating = EnhancedConditions.hasCondition(conditionName, token);

        return _isConcentrating;
    }

    /**
     * Calculates damage taken based on two health values
     * @param {*} newHealth 
     * @param {*} oldHealth
     * @returns {Number}
     */
    static _calculateDamage(newHealth, oldHealth) {
        return oldHealth - newHealth || 0;
    }
}
