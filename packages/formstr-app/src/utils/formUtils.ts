import { getDefaultRelays } from "@formstr/sdk";
import { Tag } from "@formstr/sdk/dist/formstr/nip101";
import { nip44, Event, UnsignedEvent, SimplePool } from "nostr-tools";
import { bytesToHex } from "@noble/hashes/utils"
import { sha256 } from "@noble/hashes/sha256"

const fetchKeys = async (formAuthor: string, formId: string, userPub: string) => {
	const pool = new SimplePool();
	let defaultRelays = getDefaultRelays();
	let aliasPubKey = bytesToHex(sha256(`${30168}:${formAuthor}:${formId}:${userPub}`));
	console.log("alias key calculated is", aliasPubKey)
	let giftWrapsFilter = {
		kinds: [1059],
		"#p": [aliasPubKey],
	};

	const accessKeyEvents = await pool.querySync(
		defaultRelays,
		giftWrapsFilter
	);
	console.log("Access Key events", accessKeyEvents);
	pool.close(defaultRelays)
	let keys: Tag[] | undefined;
	await Promise.allSettled(accessKeyEvents.map(async (keyEvent: Event) => {
		console.log("Decrypting event,", keyEvent)
		try{
			const sealString = await window.nostr.nip44.decrypt(
				keyEvent.pubkey,
				keyEvent.content
			);
			console.log("Got seal string as", sealString)
			const seal = JSON.parse(sealString) as Event;
			console.log("seal event is ", seal)
			const rumorString = await window.nostr.nip44.decrypt(
				seal.pubkey,
				seal.content
			);
			const rumor = JSON.parse(rumorString) as UnsignedEvent;
			console.log("rumor is ", rumor)
			let key = rumor.tags
			keys = key;
		}
		catch(e) {
			console.log("Error in decryption", e)
		}
	}));
	return keys
};


export const getFormSpec = async (formEvent: Event, userPubKey?: string, onKeysFetched?: (keys: Tag[] | null) => void): Promise<Tag[] | null> => {
	let formId = formEvent.tags.find((t) => t[0] === "d")?.[1]
	if (!formId) {
		throw Error("Invalid Form: Does not have Id");
	}
	console.log("Getting form spec")


	if (formEvent.content === "") {
		return formEvent.tags;
	}
	else {
		if(!userPubKey) throw Error("User pubkey needed for this form.")		
		let keys = await fetchKeys(formEvent.pubkey, formId, userPubKey)
		console.log("got keys as", keys)
		if(!keys) return null;
		if (onKeysFetched) onKeysFetched(keys || null)
		let viewKey = keys.find((k) => k[0] === "ViewAccess")?.[1]
		if(!viewKey) return null;
		let conversationKey = nip44.v2.utils.getConversationKey(viewKey, formEvent.pubkey)
		let formSpecString = nip44.v2.decrypt(formEvent.content, conversationKey)
		let FormTemplate = JSON.parse(formSpecString);
		return FormTemplate;
	}
};

export const getAllowedUsers = (formEvent: Event) => {
	return formEvent.tags.filter((t) => t[0] === "p").map((t) => t[1])
}

export const constructFormUrl = (pubkey: string, formId: string) => {
	return `${window.location.origin}/#/f/${pubkey}/${formId}`
}

export const constructResponseUrl = (secretKey: string, formId: string) => {
	return `${window.location.origin}/#/s/${secretKey}/${formId}`
}