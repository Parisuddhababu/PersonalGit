#!/bin/bash

# Install required packages
sudo apt install -y curl wget build-essential libssl-dev

# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Set up nvm environment variables
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the desired Node.js version
nvm install v18.20.0
sudo chown -R ubuntu: /var/www/www.commentsold.com/application/commentsold-front

# Change directory to your application directory
cd /var/www/www.commentsold.com/application/commentsold-front

# Install pm2 globally
npm install pm2 -g

# Build and restart the application with pm2
npm install && npm run build && pm2 restart commentsold-front
aws cloudfront create-invalidation --distribution-id E3A142HD978WXZ --paths '/*'