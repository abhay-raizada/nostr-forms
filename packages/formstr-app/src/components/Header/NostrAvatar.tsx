import {
  ProfileFilled,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getDefaultRelays } from "@formstr/sdk";
import { Avatar } from "antd";
import { SimplePool, Event } from "nostr-tools";
import { FC, useEffect, useState } from "react";

const defaultRelays = getDefaultRelays();

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
    const profile = await pool.get(defaultRelays, filter);
    if (profile) setProfile(JSON.parse(profile.content) as Profile);
    pool.close(defaultRelays);
  }
  useEffect(() => {
    if (!profile) getProfile();
  });
  return (
    <Avatar
      src={profile?.picture || <UserOutlined style={{ color: "black" }} />}
      alt={profile?.name}
    />
  );
};
