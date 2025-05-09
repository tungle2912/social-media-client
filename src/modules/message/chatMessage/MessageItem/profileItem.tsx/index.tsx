interface Props {
  data: any;
}

export function ProfileItem({ data: profile }: Props) {
  if (!profile) {
    return <div className="text-center text-gray-500">No profile data</div>;
  }

  return (
    <div
      className="relative w-[300px] h-[150px] bg-cover bg-center rounded-lg shadow-lg mediaImg"
      style={{ backgroundImage: `url(${profile.cover_photo})` }}
    >
      <div className="absolute bottom-[-30px] left-4 flex items-end">
        <img
          src={profile.avatar}
          alt="Avatar"
          className="w-[50px] h-[50px] rounded-full border-2 border-white shadow-md"
        />
        <span className="ml-3 text-white bg-black/50 px-2 py-1 rounded-md text-sm font-medium">
          {profile.user_name}
        </span>
      </div>
    </div>
  );
}
