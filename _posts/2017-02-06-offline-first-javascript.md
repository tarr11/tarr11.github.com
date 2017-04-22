---
layout: post
title: Offline First Javascript Libraries
published: true
tags:
  - javascript
---
I wanted to keep track off all the offline first javascript libraries I've been seeing and evaluating.

## IndexedDb API
[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

A full database supported by most major browsers.

## DexieJS 
[DexieJS](http://dexie.org/)
A well designed, thin javascript wrapper around IndexedDb that makes IndexedDB easier to use cross-platform

## PouchDb / CouchDb
[PouchDB](https://pouchdb.com/)

PouchDb is a fully JS compliant offline db that is backed by Indexeddb.  It syncs with CouchDB implementations and handles conflicts fairly well.  This is the only solution that I saw that handles most offline issues out of the box.  However, it does add more complexity as you now have to host a CouchDB server.   

## Realm
[Realm](http://www.realm.io)

An offline-first database that is mostly designed for mobile, but not web.

## GunJS
[GunJS](http://www.realm.io)

An open source offline first database with javascript clients.  Focuses on simplicity of API.

## Firebase 
[Firebase](https://firebase.google.com/)

Has support for offline - not offline first, but can handle network disruptions.   

## Parse
[Parse](https://github.com/ParsePlatform)

Open source platform similar to Firebase in that it can handle network disruptions, but is not designed for offline-first.