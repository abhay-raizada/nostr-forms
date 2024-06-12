import { getDefaultRelays } from "@formstr/sdk";
import { Avatar } from "antd";
import { SimplePool, Event } from "nostr-tools";
import { FC, useEffect, useState } from "react";

interface NostrAvatarProps {
  pubkey: string;
}

interface Profile {
  name?: string;
  picture?: string;
}
export const NostrAvatar: FC<NostrAvatarProps> = ({ pubkey }) => {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  async function getProfile() {
    let filter = {
      kinds: [0],
      authors: [pubkey],
    };
    let pool = new SimplePool();
    const profile = await pool.get(getDefaultRelays(), filter);
    if (profile) setProfile(JSON.parse(profile.content) as Profile);
  }
  useEffect(() => {
    getProfile();
  });
  return <Avatar src={profile?.picture} alt={profile?.name} />;
};
