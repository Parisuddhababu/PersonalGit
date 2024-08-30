# Text to Video with Particular Actor Speech

Creating a "Text to Video with Particular Actor Speech" involves converting written text into a video where a specific actor's speech or voice is used as the narration or voiceover.

#### Created By: Akash Sanariya

### Purpose

- Content Creation
  - Video Production
- Narration and Storytelling
  - Voiceover Narration
- Advertisement and Marketing
  - Branding and Recognition
- Online Courses
- Character Animation and Gaming
- Personalized Video Messages
- Voice Localization
- Human-like Interactions

### Prerequisites

- Node: 14.21.3
- Npm: 6.14.18
- You need an account in given `https://elai.io/` URL and need to generate `api key or token` from this website dashboard page.

### Usage & Steps to Installation

- #### Step 1:
  ```
    npm install
  ```
- #### Step 2:

  ```
    You need to create account from below url
    URL: https://app.elai.io/signup
      You can use any dummny email address and fill form and login your account with your credentials.
  ```

- #### Step 3:

  ```
    After Login Please open below url
    URL: https://app.elai.io/api
      After open this url generate your api token and store in .env file as mention below steps
  ```

- #### Step 4:
  ```
  Need to create on .env file in root folder and add inside a env file
  - REACT_APP_API_URL = "https://apis.elai.io/api/v1/"
  - REACT_APP_API_AUTHORIZATION_KEY = "Your api key generated from `elai.io` website"
  ```
- #### Step 5:
  ```
    npm run start
  ```

### References:

- https://elai.readme.io/reference/getting-started-with-your-api
- https://elai.io/

### Available Features:

- Create video from the template, ppt, copy video, translate video
- Render an existing video that was created before using another request, or with Elai Builder. It can also trigger the re-rendering of failed videos of previous batch requests.
- List of all videos
- Retrieve any of the video
- Update video
- Delete video
- Language wise List of Voices with it’s dummy voice (playable)
- Custom webhooks
- Create Avatars - Need to purchase extra
- Avatar List
- Avatar Update

### Limitation:

- We need to purchase any subscription before used in production
- If we need to create our own custom avatar then first we need to purchase and then only we can check it’s feasibility
- Only available voice of avatar can be selected
- In trial free account some of the avatar voices available so we can select only from that avatar voice
- In trial free account we can create video maximum one minutes not more than that
- Supported and available framework for api integration you can check from the api listing documentation link
- We need to integrate axios for react application for elai.io api calling
- We can’t use graphql because it is not supported
- Single video create it will take minimum 3-4 minutes based on text, video avatar, avatar voice depending on input of videos

### Snapshot

![Text to Video Speech](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Video%20%26%20Audio%20%26%20Images%20%26%20Text/text-to-video-speech-reactjs/Applicatio%20Snapshot/text-to-video-speech-reactjs.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)
