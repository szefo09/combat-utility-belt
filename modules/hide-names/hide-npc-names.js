import { Sidekick } from "../sidekick.js";
import { SETTING_KEYS, NAME, PATH, FLAGS, DEFAULT_CONFIG } from "../butler.js";
import { HideNPCNamesActorForm } from "./actor-form.js";

export class HideNPCNames {
    /**
     * 
     * @param {*} message 
     * @param {*} data 
     * @param {*} options 
     * @param {*} user 
     */
    static _onPreCreateChatMessage(message, data, options, user) {
        // use most of the logic from render
        // add a flag to the data payload marking the message as needing hiding
        // include the replacement name
    }

    /**
     * Handle render Actor sheet
     * @param {*} app 
     * @param {*} html 
     * @param {*} data 
     */
    static _onRenderActorSheet(app, html, data) {
        const enableSetting = Sidekick.getSetting(SETTING_KEYS.hideNames.enable);

        if (!enableSetting) return;
        
        const disposition = app.object.data.token.disposition;
                
        const enableHostile = Sidekick.getSetting(SETTING_KEYS.hideNames.enableHostile);
        const enableNeutral = Sidekick.getSetting(SETTING_KEYS.hideNames.enableNeutral);
        const enableFriendly = Sidekick.getSetting(SETTING_KEYS.hideNames.enableFriendly);

        const formButtonHtml = `<a style="flex: 0" title="${game.i18n.localize("HIDE_NAMES.ActorSheetButton")}"><i class="fas fa-mask"></i></a>`;

        const button = $(formButtonHtml);
        const header = html.find("header.window-header");
        const title = header.length ? header.find(".window-title") : html.closest(".app").find(".window-title");

        title.prepend(button);
        
        button.on("click", event => new HideNPCNamesActorForm(app.object).render(true));
    }

    /**
     * Hooks on the Combat Tracker render to replace the names
     * @param {Object} app - the Application instance
     * @param {Object} html - jQuery html object
     * @todo refactor required
     */
    static _onRenderCombatTracker(app, html, data) {
        const enable = Sidekick.getSetting(SETTING_KEYS.hideNames.enable);

        if (!enable) return;

        // find the NPC combatants
        const combatants = app?.viewed?.combatants?.contents;

        if (!combatants || !combatants?.length) return;

        const tokens = combatants.filter(c => c.token).map(c => c.token);
        
        const npcs = tokens.filter(t => {
            const actor = t.actor || game.actors.get(t.actorId);
            
            if (actor?.hasPlayerOwner === false) return true;
        });

        if (!npcs.length) return;

        // check if name should be hidden
        const hideNPCs = npcs.filter(n => HideNPCNames.shouldReplaceName(n.actor)).map(npc => {
            const replacementName = HideNPCNames.getReplacementName(npc.actor);
            
            return {
                id: npc.id ?? npc.id,
                name: npc.name,
                replacement: replacementName,
                isOwner: npc.actor.isOwner
            }
        });

        if (!hideNPCs.length) return;

        const hideNPCIds = hideNPCs.map(n => n.id);

        // for each replacement, find the matching element and replace
        const combatantListElement = html.find("li");

        for (const el of combatantListElement) {
            const combatantId = el.dataset.combatantId;
            const combatant = game.combat.combatants.get(combatantId);
            const npcToken = hideNPCs.find(n => n.id === combatant?.token?.id);
            
            if (!npcToken) continue;

            if (game.user.isGM || npcToken.isOwner) {
                const icon = `<span> <i class="fas fa-mask" title="${npcToken.replacement}"></i></span>`;
                $(el).find(".token-name").children().first().append(icon);
                continue;
            }

            $(el).find(".token-name").text(npcToken.replacement);
            $(el).find(".token-image").attr("title", npcToken.replacement);            
        }
        
    }

    /**
     * Handles name replacement for chat messages
     * @param {*} message 
     * @param {*} html 
     * @param {*} data 
     */
    static async _onRenderChatMessage(message, html, data) {
        const enable = Sidekick.getSetting(SETTING_KEYS.hideNames.enable);
        const name = data?.alias ?? null;
        const speaker = message.data.speaker;

        if (!enable || !name || !speaker) return;

        const actor = ChatMessage.getSpeakerActor(speaker);

        if (!actor) return;
        
        const speakerIsNPC = !actor.hasPlayerOwner;

        if (!speakerIsNPC) return;

        const shouldReplace = HideNPCNames.shouldReplaceName(actor);

        if (!shouldReplace) return;

        const replacementName = HideNPCNames.getReplacementName(actor);

        // If we are the GM or the Actor's owner, simply apply the icon to the name and return
        if (game.user.isGM || actor.isOwner) {
            const senderName = html.find("header").children().first();
            const icon = `<span> <i class="fas fa-mask" title="${replacementName}"></i></span>`;
            return senderName.append(icon);
        }

        const hideParts = Sidekick.getSetting(SETTING_KEYS.hideNames.hideParts);
        let matchString = null;

        // If there's a space in the name, and name parts should be hidden
        // then perform additional manipulation
        if (name.includes(" ") && hideParts) {
            const parts = name.trim().split(/\s/).filter(w => w.length);
            const terms = Sidekick.getTerms(parts);

            // Ensure there is still terms
            if (terms.length) {
                // If the first term is not exactly the name provided, use the name instead
                // this accounts for names with multiple consecutive spaces
                if (terms[0] !== name) terms[0] = name;

                matchString = terms
                    .map(t => {
                        t = t.trim();
                        t = Sidekick.escapeRegExp(t);
                        return t;
                    })
                    .filter(t => t.length)
                    .join("|");
            }
        }
        
        // Escape regex in the match to ensure it is parsed correctly
        matchString = matchString ?? Sidekick.escapeRegExp(name);

        const regex = `(${matchString})(?=\\s|[\\W]|s\\W|'s\\W|$)`;
        const pattern = new RegExp(regex, "gim");

        // Do a replacement on the document
        Sidekick.replaceOnDocument(pattern, replacementName, {target: html[0]});

        // Finally hide the footer if that option is enabled
        const hideFooter = Sidekick.getSetting(SETTING_KEYS.hideNames.hideFooter);

        if (hideFooter) {
            const cardFooter = html.find(".card-footer");
            return cardFooter.prop("hidden", true);
        }
    }

    /**
     * Replaces instances of hidden name in VIsual NOvel for Foundry (ViNo)
     * @param {Object} chatDisplayData
     */
    static _onVinoPrepareChatDisplayData(chatDisplayData) {
        const enable = Sidekick.getSetting(SETTING_KEYS.hideNames.enable);
        const name = chatDisplayData?.name;
        const speaker = chatDisplayData.message?.data?.speaker;

        if (!enable || !chatDisplayData || !name || !speaker) return;

        const actor = ChatMessage.getSpeakerActor(speaker);

        if (!actor) return;
        
        const speakerIsNPC = !actor.hasPlayerOwner;

        if (!speakerIsNPC) return;

        const shouldReplace = HideNPCNames.shouldReplaceName(actor);

        if (!shouldReplace) return;

        const replacementName = HideNPCNames.getReplacementName(actor);
        
        if (!game.user.isGM || !actor.isOwner) {
           chatDisplayData.name = replacementName;
        }
    }

    /**
     * Replace names in the image popout
     * @param {*} app 
     * @param {*} html 
     * @param {*} data 
     */
    static _onRenderImagePopout(app, html, data) {
        const enable = Sidekick.getSetting(SETTING_KEYS.hideNames.enable);
        const uuid = app.options?.uuid;
        const actor = uuid.startsWith("Actor") ? game.actors.get(uuid.replace("Actor.", "")) : null;

        if (!actor || !enable) return;

        const shouldReplace = HideNPCNames.shouldReplaceName(actor);

        if (actor.hasPlayerOwner || !shouldReplace) return;

        const windowTitle = html.find(".window-title");

        const replacement = HideNPCNames.getReplacementName(actor);

        if (windowTitle.length === 0) return;

        if (!game.user.isGM || !actor.isOwner) {
            windowTitle.text(replacement);

            const imgDiv = html.find("div.lightbox-image");

            if (!imgDiv.length) return;

            imgDiv.attr("title", replacement);
        } else {
            const icon = `<span> <i class="fas fa-mask" title="${replacement}"></i></span>`;

            windowTitle.append(icon);
        }

        
    }

    /**
     * Handles Combat Carousel render
     * @param {*} app 
     * @param {*} html 
     * @param {*} data 
     */
    static _onRenderCombatCarousel(app, html, data) {
        const combatantCards = html.find(".card");

        for (const card of combatantCards) {
            const $card = $(card);
            const combatantId = card.dataset.combatantId;
            const combatant = game.combat.getCombatant(combatantId);
            const token = canvas.tokens.get(combatant.tokenId);
            const actor = token.actor;

            // @todo append mask icon
            if (game.user.isGM || actor.isOwner) continue;

            if (HideNPCNames.shouldReplaceName(actor)) {
                const nameDiv = $card.find("div.name");
                const avatarDiv = $card.find("div.avatar");
                const avatar = avatarDiv.find("img");
                const nameHeader = nameDiv.find("h3");
                const name = nameHeader.text();
                const replacement = HideNPCNames.getReplacementName(actor);
                if (!replacement) continue;

                nameHeader.text(replacement);
                avatar.attr("title", replacement);
                nameHeader.attr("title", replacement);
            }
        }
        
    }

    /**
     * Checks an actor to see if its name should be replaced
     * @param {*} actor 
     * @returns {Boolean} shouldReplace
     */
    static shouldReplaceName(actor) {
        const dispositionEnum = actor.isToken ? actor.token.data.disposition : actor.data.token.disposition;
        const disposition = Sidekick.getKeyByValue(CONST.TOKEN_DISPOSITIONS, dispositionEnum);
        const dispositionEnableSetting = Sidekick.getSetting(SETTING_KEYS.hideNames[`enable${disposition.titleCase()}`]);
        const actorEnableFlag = actor.getFlag(NAME, FLAGS.hideNames.enable);
        const enableHide = actorEnableFlag ?? dispositionEnableSetting;

        return !!enableHide;
    }

    /**
     * For a given actor, find out if there is a replacement name and return it
     * @param {*} actor 
     * @returns {String} replacementName
     */
    static getReplacementName(actor) {
        const dispositionEnum = actor.isToken ? actor.token.data.disposition : actor.data.token.disposition;
        const disposition = Sidekick.getKeyByValue(CONST.TOKEN_DISPOSITIONS, dispositionEnum);
        const replacementSetting = Sidekick.getSetting(SETTING_KEYS.hideNames[`${disposition.toLowerCase()}NameReplacement`]);
        const replacementFlag = actor.getFlag(NAME, FLAGS.hideNames.replacementName);
        const replacementName = replacementFlag ?? replacementSetting;

        return replacementName;
    }

    /**
     * Replacement type options
     * @todo implement or delete
     */
    static get replacementTypes() {
        return {
            race: "Race",
            type: "Type",
            other: "Other"
        }
    }
}