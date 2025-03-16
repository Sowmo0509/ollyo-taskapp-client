const UserAvatar = ({ size, fontSize, name }: { size: number; fontSize: string; name: string }) => {
  return (
    <div style={{ width: size, height: size }} className={`bg-zinc-200 rounded-full flex justify-center items-center`}>
      <p className="uppercase font-medium select-none" style={{ fontSize }}>
        {name.slice(0, 2)}
      </p>
    </div>
  );
};

export default UserAvatar;
