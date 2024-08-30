// resolvers.js

let banners = [
    { id: "1", title: "Banner 1", description: "Description for Banner 1" },
    { id: "2", title: "Banner 2", description: "Description for Banner 2" },
  ];
  
  export const BannerResolvers = {
    Query: {
      banners: () => banners,
      banner: (parent, args) => banners.find(banner => banner.id === args.id),
    },
    Mutation: {
      createBanner: (parent, args) => {
        const newBanner = { id: String(banners.length + 1), ...args };
        banners.push(newBanner);
        return newBanner;
      },
      updateBanner: (parent, args) => {
        const banner = banners.find(banner => banner.id === args.id);
        if (!banner) return null;
        Object.assign(banner, args);
        return banner;
      },
      deleteBanner: (parent, args) => {
        const bannerIndex = banners.findIndex(banner => banner.id === args.id);
        if (bannerIndex === -1) return null;
        const [deletedBanner] = banners.splice(bannerIndex, 1);
        return deletedBanner;
      },
    },
  };
  