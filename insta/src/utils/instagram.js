export const extractFollowers = (data) => {
  if (!data) return [];
  return data.map(
    (item) => item.string_list_data[0].value
  );
};

export const computeStats = (followers, following) => {
  const followerSet = new Set(followers);
  const followingSet = new Set(following);

  const notFollowingBack = [...followingSet].filter(
    (u) => !followerSet.has(u)
  );

  const fans = [...followerSet].filter(
    (u) => !followingSet.has(u)
  );

  const mutual = [...followerSet].filter((u) =>
    followingSet.has(u)
  );

  return { notFollowingBack, fans, mutual };
};
