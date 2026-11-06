export default function AvatarIllustration() {
  return <svg className="avatar-illustration" viewBox="0 0 260 280" role="img" aria-labelledby="avatar-title avatar-description">
    <title id="avatar-title">Deepesh Singh, illustrated avatar</title>
    <desc id="avatar-description">An original friendly geometric avatar illustration, not a photograph.</desc>
    <defs>
      <linearGradient id="avatar-skin" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#f6cdb8"/><stop offset="1" stopColor="#d98f72"/></linearGradient>
      <linearGradient id="avatar-shirt" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#2d8479"/><stop offset="1" stopColor="#174b50"/></linearGradient>
      <linearGradient id="avatar-hair" x1="0" x2="1"><stop stopColor="#24313b"/><stop offset="1" stopColor="#111b24"/></linearGradient>
    </defs>
    <ellipse cx="130" cy="256" rx="74" ry="12" fill="#9dcfc8" opacity=".32"/>
    <path d="M51 250c4-40 31-68 79-68s75 28 79 68v7H51z" fill="url(#avatar-shirt)"/>
    <path d="M108 176h44v39c-7 12-37 12-44 0z" fill="url(#avatar-skin)"/>
    <path d="M76 90c0-43 23-66 56-66 37 0 57 25 57 67v47c0 38-27 64-59 64-31 0-54-28-54-63z" fill="url(#avatar-skin)"/>
    <path d="M76 105c-14-39 1-78 32-87 28-8 58-2 72 21 12 19 10 39 5 56-6-21-16-35-31-43-22 13-48 16-72 11l-6 42z" fill="url(#avatar-hair)"/>
    <path d="M104 124c6-5 14-5 20 0M143 124c6-5 14-5 20 0" fill="none" stroke="#553c36" strokeWidth="4" strokeLinecap="round"/>
    <ellipse cx="116" cy="142" rx="3.5" ry="5" fill="#27313a"/><ellipse cx="151" cy="142" rx="3.5" ry="5" fill="#27313a"/>
    <path d="M120 165c8 8 21 8 29 0" fill="none" stroke="#9c5548" strokeWidth="3" strokeLinecap="round"/>
    <path d="m87 198 43 33 43-33 18 52H69z" fill="url(#avatar-shirt)"/>
    <path d="m117 211 13 14 13-14" fill="none" stroke="#b6e5da" strokeWidth="2"/>
    <circle cx="200" cy="72" r="17" fill="#f5e4bc" opacity=".8"/><path d="M194 72h12M200 66v12" stroke="#9a7b42" strokeWidth="2" strokeLinecap="round"/>
  </svg>;
}
