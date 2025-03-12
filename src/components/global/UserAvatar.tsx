const UserAvatar = ({ size, fontSize, name }: { size: string; fontSize: string; name: string }) => {
  return (
    <div className={`bg-zinc-200 w-${size} rounded-full h-${size} flex justify-center items-center`}>
      <p className="uppercase font-medium select-none" style={{ fontSize }}>
        {name.slice(0, 2)}
      </p>
    </div>
  );
};

export default UserAvatar;
