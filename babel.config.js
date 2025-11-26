module.exports = function (api) {
  api.cache(true);

const isDev = process.env.APP_ENV === "development" || process.env.NODE_ENV === "development";
const envFile = isDev ? ".env.development" : ".env.production";
console.log(`🔹 Using env file: ${envFile}`);



  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: envFile,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
