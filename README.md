# 🧠 Chat-AI

An intelligent, AI assistant web application built using modern technologies including **Next.js**, **TypeScript**, **Tailwind CSS**, **Zustand**, **Prisma**, **PostgreSQL**, and **Axios**.

## ✨ Features

- 🤖 Real-time AI conversations 
- 🗂️ Persistent chat history with session-based storage
- ✍️ Dynamic InputBox for message interaction
- 🧠 Zustand for global chat state management
- 💾 PostgreSQL database integration with Prisma ORM
- 🔐 Google authentication via NextAuth 

## 🛠️ Tech Stack

| Frontend     | Backend        | Database     | Auth       |
|--------------|----------------|--------------|------------|
| Next.js      | Next.js API    | PostgreSQL   | NextAuth   |
| TypeScript   | Axios          | Prisma ORM   | Google OAuth|
| Tailwind CSS | Zustand        |              |            |

## 📸 Screenshots



## 🚀 Getting Started 

##🔁 Zustand for Global State Management
Challenge: Sharing chat state (chat ID, messages, etc.) across multiple components without prop drilling.

I used Zustand to create a lightweight global store that keeps track of:

The current chatId

The chat messages list

Whether a chat session is active or not

This allowed me to easily:

Resume existing chats when opened

Automatically update the UI after sending a new message

Close or reset a chat from anywhere in the app

## web flow
User types prompt ➜ Send to backend ➜ Receive response ➜ Create newPair ➜ Call addPair(newPair)->newPair added 

