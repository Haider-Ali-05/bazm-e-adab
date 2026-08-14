import React from 'react';

interface UserAvatarProps {
  url?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({ url, name, size = 'md' }: UserAvatarProps) {
  const firstLetter = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className={`avatar avatar-${size}`} title={name}>
      {url ? (
        <img src={url} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <span>{firstLetter}</span>
      )}
    </div>
  );
}
