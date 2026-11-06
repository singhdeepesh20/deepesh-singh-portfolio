import Image from "next/image";

export default function AvatarIllustration() {
  return (
    <Image
      className="avatar-illustration"
      src="/assets/photo/deepesh-avatar-matched.jpeg"
      alt="Anime-style illustrated avatar of Deepesh Singh wearing glasses."
      width={720}
      height={720}
      sizes="(max-width: 760px) 80vw, 480px"
      priority
    />
  );
}
