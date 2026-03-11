# UT Bike Passport MVP

## Working Idea

Build a UT-focused bike safety platform that combines:

- bike passport and proof of ownership
- theft reporting
- campus incident visibility
- recovered bike matching

## Problem We Are Actually Solving

UT riders are afraid to bike because prevention, ownership verification, theft reporting, and recovery are fragmented across different systems. Students do not have one trusted place to:

- document ownership before a theft
- quickly report a stolen bike with high-quality details
- see where recent incidents are happening
- get notified when a recovered bike may be theirs

## Why This Is Strong

- It solves an emotional and recurring student problem.
- It is clearly tied to campus life.
- It can outlive a hackathon if UT Transportation, UTPD, or a student org adopts it.
- It improves both prevention and recovery instead of only tracking after theft.

## Deep Critique

### What Is Strong

- The bike passport is useful even before a theft happens.
- The recovery workflow targets a real gap: many recovered bikes go unclaimed.
- A map of recent incidents can change behavior if it is current and actionable.
- The system can be valuable even without custom hardware.

### What Is Weak

- This is not really one problem. It is four products:
  - registration
  - incident map
  - stolen bike reporting
  - recovered bike matching
- UT may already have partial workflows for registration and police reporting, so replacing them is harder than integrating with them.
- The recovered-bike flow only works if the party finding bikes actually uses the platform.
- Matching bikes from photos and descriptions is hard and can create false positives.
- Students may not register until after a theft, which is too late.
- A map with stale or low-quality data can create fear without improving outcomes.

### Biggest Strategic Risk

The concept is strongest as a workflow layer, not as a brand-new institutional system.

If we pitch this as "UT should replace its entire process," that is a heavy adoption ask.

If we pitch it as "a student-friendly layer that makes existing UT workflows actually usable," it becomes much more realistic.

## Best Narrow Version

Do not build the full institutional platform first.

Build the wedge that creates value fastest:

1. Bike passport
2. One-tap stolen bike report packet
3. Recovered bike matching alerts

Treat the incident map as a secondary feature, not the core product.

## Recommended MVP

### MVP Goal

Help a student create a strong ownership record before theft and make recovery easier after theft.

### MVP Features

#### 1. Bike Passport

- user account
- bike nickname
- make
- model
- color
- frame size
- serial number
- purchase date
- purchase receipt upload
- bike photos upload
- lock type
- common parking locations

#### 2. Stolen Bike Mode

- mark bike as stolen
- date and time last seen
- location last seen
- notes on lock/circumstances
- instantly generate a shareable bike poster
- generate a clean report packet for UTPD or APD

#### 3. Recovery Matching

- admin or trusted partner can upload recovered bike details
- match against stolen passports by:
  - serial number exact match
  - make/model similarity
  - color similarity
  - visual/photo review by owner
- notify user when confidence is high enough

### Nice-to-Have Features

- recent theft map
- QR or NFC ownership tag
- mobile-friendly camera-first flow
- analytics for high-risk parking zones
- community tips and alerts

## Users

### Primary User

Student rider who wants peace of mind and faster recovery if theft happens.

### Institutional Partners

- UT Parking and Transportation Services
- UTPD
- student government
- residence halls
- campus bike shops

## What We Should Not Build First

- custom UWB infrastructure
- campus-wide hardware network
- full police evidence management
- fully automated image-based bike identification
- a marketplace for recovered bikes

## Why Hardware Should Be Secondary

Custom hardware is expensive, easy to remove, and hard to deploy at campus scale.

A hardware add-on can help later, but the product should already work without it.

Best future hardware add-ons:

- hidden BLE tag in reflector or seat post
- QR tamper-evident ownership sticker
- lock tamper alarm prototype

## Hard Questions We Need to Answer

- How do we get students to register before theft?
- Who is allowed to upload recovered bikes?
- How do we avoid alert spam from weak matches?
- How do we route reports correctly between UTPD and APD?
- What data can we get reliably for the incident map?
- Who owns the system after the hackathon?

## Pitch Version

UT students want to bike, but theft risk and poor recovery workflows make them feel unsafe. UT Bike Passport gives riders one place to prove ownership, report theft quickly, and get matched to recovered bikes before they disappear into surplus or go unclaimed.

## Success Metrics

- passports created
- stolen bike reports generated
- recovered bikes uploaded
- matches confirmed
- time from recovery listing to owner notification
- percentage of uploaded bikes with enough data to identify an owner

## Build Order

1. Bike passport data model and uploads
2. Stolen bike reporting flow
3. Recovered bike listing and manual matching
4. User alerts
5. Incident map

## Current Git/GitHub Status

- local git repo exists
- no commits yet
- no remote configured
- GitHub CLI is not installed in this environment

To connect this project to GitHub later, we will need either:

- a remote repository URL, or
- GitHub CLI/auth set up on this machine