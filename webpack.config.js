const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');



module.exports = {
  mode: "development",
  entry: "./src/JS/index.js",
  output:{
    filename: "bundle.js",
    path: path.resolve(__dirname, "build")
  },
  devServer:{
    contentBase: "./build"
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, 
          {
            loader: "css-loader", 
            options:{importLoaders:1}
          }, 
          {  
            loader: 'postcss-loader',  
            options: {   
              postcssOptions:{ 
                plugins: [
                  require('autoprefixer')({
                    overrideBrowserslist: ['last 3 versions', 'ie >9']
                  })    
                ]  
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: "style.css"
    }),
    new HtmlWebpackPlugin({
      title: "Air Quality Index Displayer",
      template: "./src/template.html"
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      `...`,
      new CssMinimizerPlugin(),
    ],
  }
}