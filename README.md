# Updating Front-End files
1. Change directory to React root directory
```cd ~/client```
2. Create build 
```npm run build```
3. Change directory to website public files
```cd /var/www/react-build```
4. Remove old build
Make sure you are in the correct directory before running the following command
```sudo rm -rf *```
5. Change directory to new build
```cd ~/client/build```
6. Copy new build in website public files
```sudo cp -r * /var/www/react-build```

# New setup
1. copy .env.dev to .env
```cp .env.dev .env```
2. modify .env file
REACT_APP_MAINSITE - website public url
REACT_APP_BACKEND - api public url
REACT_APP_PUBLIC_UPLOADS - storage uploads location
REACT_APP_PUBLIC_RESOURCES - storage resources location
REACT_APP_RECAPTCHA_KEY - recaptcha key
REACT_APP_ENABLE_INTL - flag to enable multi-language
