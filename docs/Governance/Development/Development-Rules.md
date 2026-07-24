# AI Director Development Rules

---

Document ID

DEV-RULE-001

Title

Development Rules

Version

Build001-A

Status

Living Document

Last Updated

2026-07

---

# Purpose

This document defines the development rules for AI Director.

The objective is to maintain a stable, traceable and scalable development process while allowing the product to evolve continuously.

These rules describe **how** the project is developed.

They do not define product features.

---

# Rule 001

Single Source of Truth

The GitHub Repository is the only official source.

Every implementation must be based on the current Repository.

No implementation should rely on memory or outdated files.

---

# Rule 002

Analysis Before Coding

Before implementing a Feature,

Repository analysis must be completed.

Implementation starts only after the current structure is understood.

---

# Rule 003

Repository Audit

Every major Build begins with a Repository Audit.

The Audit records the current architecture and module status.

It provides the baseline for future development.

---

# Rule 004

Architecture Decisions

Architectural changes must be documented using Architecture Decision Records (ADR).

Existing ADR documents are never modified.

A new ADR is created whenever a significant architectural decision is made.

---

# Rule 005

Incremental Development

Existing architecture should be extended whenever practical.

Large-scale rewrites require clear technical justification.

Development should proceed through small, verifiable steps.

---

# Rule 006

Feature-Based Development

Development is organised by Feature.

Each Feature should have:

• Design

• Implementation

• Acceptance Test

• Git Commit

Completion of one Feature precedes the next.

---

# Rule 007

Repository Structure

Project structure should remain organised.

New modules should be added according to existing conventions.

Unnecessary duplication should be avoided.

---

# Rule 008

Documentation

Major architectural or workflow changes must be reflected in documentation.

Relevant documents include:

• Architecture

• Data Dictionary

• Terminology

• ADR

• Release Notes

---

# Rule 009

Testing

Every completed Feature should be verified before merge or release.

Testing includes:

Functional Test

Workflow Verification

Regression Check

---

# Rule 010

Version Control

Each completed Feature should be committed to GitHub.

Commit history should clearly describe the completed work.

Repository history must remain understandable.

---

# Evolution

These rules are intended to evolve with AI Director.

When improvements are identified,

this document should be updated rather than replaced.

---

# Related Documents

Repository Audit

Architecture Decisions

Build Roadmap

Architecture

Release Notes

---

# Approval

Project

AI Director

Document

Development Rules

Status

Living Document

Version

Build001-A
