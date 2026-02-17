# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [1.0.34]

### Changed
- Rating and comment are now both optional — user must provide at least one

## [1.0.33]

### Added
- `metadata` prop for attaching arbitrary key-value data to each feedback submission
- Global Escape key listener to close the widget from anywhere on the page

### Changed
- Removed `shareEmail` field from submission payload
- Fixed README to show correct 4-emoji rating system

## [1.0.32]

### Changed
- Renamed backend references to Usero
- Form now clears after submission while keeping the panel open

## [1.0.31]

_No user-facing changes (internal version bump)._

## [1.0.30]

_No user-facing changes (internal version bump)._

## [1.0.29]

### Changed
- Further bundle size reduction

## [1.0.28]

### Added
- Pre-warm ping on widget open to reduce cold start latency

### Fixed
- Primary color now correctly applied to the submit button in the panel
- Fixed gradient rendering and primary color usage on the feedback button

## [1.0.27]

### Changed
- Significant bundle size reductions

## [1.0.26]

### Changed
- Major bundle size improvements
- Added screenshot API instructions to documentation

### Fixed
- Various internal simplifications to reduce bundle size

## [1.0.25]

### Added
- Screenshot image compression for smaller uploads

## [1.0.24]

### Added
- Screenshot capture support

## [1.0.23]

### Added
- Initial public release
- Emoji-based feedback rating system
- Feedback panel with comment input
- Configurable position, title, and placeholder text
- Runtime style injection (no external CSS)
- Usero backend integration
