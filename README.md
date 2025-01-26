# TLDR.AI #


<img src="/extension/images/tagline.png" alt="TLDR" width=75% height=75%>

<!-- Insert logo + tagline -->
## Overview ##

How many times have you signed up for an app without knowing what you're signing up for?

Most people don't want to read privacy policies or user agreements, but if you knew what was in there, you'd probably think twice before you sign. That's where **TLDR.AI** comes in.

TLDR.AI reads your contracts so you don't have to. When you sign up for a new account on a website, we scan all their legal agreements to find red flags and sketchy details. 

Then, our Chrome extension summarizes the dangers in a few short sentences so you know what you're signing up for.

## How it Works ##

When you open a website's sign up page, TLDR loads the page's legal agreements and sends the contract to our backend, which we host using FastAPI.

Then, we pass the contract to our Cohere AI model along with a clear prompt and keywords to look for.

The model reviews the contract and summarizes 3-5 dangerous points, each with a citation to the original text for full detail.

## Technology

**Frontend**: HTML, CSS, JS

**Backend**: FastAPI, Python, Cohere

## Our Team ##

- [@caitlinroach06](https://github.com/CaitlinRoach06) Caitlin Roach
- [@pooriaahmadi](https://www.github.com/pooriaahmadi) Pooria Ahmadi
- [@dolev497](https://github.com/Dolev497) Dolev Klein
- [@evince05](https://github.com/evince05) Elliott Vince



