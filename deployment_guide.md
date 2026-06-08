# Biscuit Bazar Deployment Guide

## GitHub Pages Deployment

Your frontend has been completely decoupled from the local backend and uses **Firebase** for data storage natively. This means you can deploy your application extremely easily and strictly for free on **GitHub Pages**, **Vercel**, or **Netlify**.

### Steps to Deploy to GitHub

1. Click the **Export to GitHub** button in AI Studio, or download this repository locally.
2. In your GitHub repository, simply go to your repository **Settings > Pages**.
3. If using **Vercel** or **Netlify**, import your GitHub repository, use framework preset "Vite" (Build Command: `npm run build`, Publish Directory: `dist`).

### Data Settings (Firebase)
Because your frontend interacts securely with your Firebase Firestore, your dynamic content like *Products, Banners, Orders* will continue to work perfectly and securely when hosted live on GitHub! Note that all data is fetched in real-time from the Google Cloud.
