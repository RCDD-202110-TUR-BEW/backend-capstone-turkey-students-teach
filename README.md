

# Students Teach 👩‍🎓👨🏿‍🎓
<p float="right">Created by students for students</p>
<p>
  <b>Students Teach</b> is a platform that connects students with other students and creates an environment where students help each other out!
</p>

## ⚡️ Quickstart

To get a local copy up and running follow steps below:

### Prerequisites
Below tools are required to run the application:
* node.js ([how to install](https://nodejs.org/en/download/))
* yarn or npm

### Installation
Open your terminal and paste below commands:

```shell
git clone git@github.com:RCDD-202110-TUR-BEW/backend-capstone-turkey-students-teach.git
cd backend-capstone-turkey-students-teach
```
It clones the repo and goes to the cloned directory.
Change the .envsample file name as .env, and fill it with your information. 
```shell
yarn
```
It installs the dependencies
```shell
yarn start
```
It runs the app in the development mode.
Default port is [http://localhost:3000](http://localhost:3000) 
You will also see any lint errors in the console.
```shell
yarn test
```
Launches the test runner

## 🎯 Features

- Students can register / login via JWT or Google Auth
- Students can become tutors 
- Students can ask and/or answer the questions
- Users can filter and search questions and tutors
- Students can communicate inside channels
- Crud operations for questions
- Crud operations for tutors
- Crud operations for messaging channels
- Middleware for only auth and only tutor
- Unit tests via using jest framework