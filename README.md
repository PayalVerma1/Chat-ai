# 🧠 Chat-AI

An intelligent, AI assistant web application built using modern technologies including **Next.js**, **TypeScript**, **Tailwind CSS**, **Zustand**, **Prisma**, **PostgreSQL**, and **Axios**.

---

## ✨ Features

- 🤖 Real-time AI conversations 
- 🗂️ Persistent chat history with session-based storage
- ✍️ Dynamic InputBox for message interaction
- 🧠 Zustand for global chat state management
- 💾 PostgreSQL database integration with Prisma ORM
- 🔐 Google authentication via NextAuth 

---

## 🛠️ Tech Stack

| Frontend     | Backend        | Database     | Auth         |
|--------------|----------------|--------------|--------------|
| Next.js      | Next.js API    | PostgreSQL   | NextAuth     |
| TypeScript   | Axios          | Prisma ORM   | Google OAuth |
| Tailwind CSS | Zustand        |              |              |

---

## 🚀 Getting Started

## 🔁 Zustand for Global State Management

**Challenge**: Sharing chat state (chat ID, messages, etc.) across multiple components without using prop drilling.

**Solution**: Zustand was used to create a global store to manage the current chat ID, message list, and chat session status. This allowed resuming existing chats, updating the UI after sending a message, and resetting the chat from anywhere in the app.

---

## 🌐 Web Flow

User types prompt ➜ Sent to backend ➜ Response received ➜ New pair created ➜ addPair(newPair) called ➜ UI updated

---

## 🧩 Challenges Faced & How I Solved Them

### 1. Google Authentication Problem

One of the first issues I faced was with Google authentication using NextAuth. After logging in, the user’s session wasn’t being preserved properly, which caused issues when trying to access user-specific data like chat history.

**How I Solved It**:  
The issue was due to not setting up the necessary callback configuration in the NextAuth setup. Once I added the callback to properly include the user's ID in the session, everything started working as expected. This step is essential; otherwise, user identity isn't maintained across the session.


### 2. Confusion While Creating Schema in Prisma

Initially, I was unsure how to structure my database to handle the prompt-response chat structure. I created a `Pair` model for prompt and response but wasn't sure how to connect them to a chat properly.

**How I Solved It**:  
After some trial and error, I decided to keep the prompt-response pairs as a list within each chat session. This made it easier to retrieve all messages for a specific chat and allowed me to model the conversation as a collection of prompt-response pairs linked to a single chat.

### 3. Multiple Chats Being Created Incorrectly

Another major challenge was managing multiple chats. Initially, each new session wasn't properly isolated — either new chat was created for each prompt , or the messages would appear in the wrong place.

**How I Solved It**:  
I implemented a dedicated route that checks if a chat ID is passed. If no ID is provided, a new chat session is created and the user is redirected to a unique route containing the new chat ID. This allowed me to display and resume conversations based on specific IDs, keeping each chat separate and persistent which helped me to add new content to the previous chat if sent.


