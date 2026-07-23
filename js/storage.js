/* =====================================================
   AI Director V10
   Build001-B
   Feature 1 : Dashboard
   File : storage.js
===================================================== */

"use strict";

const Storage = (() => {

    const STORAGE_KEY = "AI_DIRECTOR_V10";

    /* =====================================================
       Default Database
    ===================================================== */

    const defaultData = {

        version: "10.0.0",

        projects: []

    };

    /* =====================================================
       Database
    ===================================================== */

    function load() {

        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {

            save(defaultData);

            return structuredClone(defaultData);

        }

        try {

            return JSON.parse(raw);

        }

        catch {

            return structuredClone(defaultData);

        }

    }

    function save(data) {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(data)

        );

    }

    function reset() {

        localStorage.removeItem(STORAGE_KEY);

        save(defaultData);

    }

    /* =====================================================
       Helpers
    ===================================================== */

    function uuid() {

        return crypto.randomUUID();

    }

    function now() {

        return new Date().toISOString();

    }

    /* =====================================================
       Project
    ===================================================== */

    function getProjects() {

        return load().projects;

    }

    function getSortedProjects() {

        const projects = getProjects();

        return [...projects].sort((a, b) => {

            if (a.pinned !== b.pinned) {

                return a.pinned ? -1 : 1;

            }

            return new Date(b.updatedAt) -

                   new Date(a.updatedAt);

        });

    }

    function getProject(projectId) {

        return getProjects().find(

            project => project.id === projectId

        );

    }

    function createProject({

        name,

        client,

        brand,

        description

    }) {

        const db = load();

        const project = {

            id: uuid(),

            name,

            client,

            brand,

            description,

            pinned: false,

            status: "進行中",

            currentStage: "前期企劃",

            archived: false,

            productions: [],

            materials: {

                products: [],

                brands: [],

                logos: [],

                documents: []

            },

            preProduction: {

                coreMessage: "",

                targetAudience: "",

                shootingStyle: "",

                rhythm: "",

                referenceVideos: "",

                delivery: "",

                memo: ""

            },

            createdAt: now(),

            updatedAt: now()

        };

        db.projects.push(project);

        save(db);

        return project;

    }

    function updateProject(project) {

        const db = load();

        const index = db.projects.findIndex(

            item => item.id === project.id

        );

        if (index < 0) return;

        project.updatedAt = now();

        db.projects[index] = project;

        save(db);

    }

    function deleteProject(projectId) {

        const db = load();

        db.projects = db.projects.filter(

            project => project.id !== projectId

        );

        save(db);

    }

    function togglePinned(projectId) {

        const project = getProject(projectId);

        if (!project) return;

        project.pinned = !project.pinned;

        updateProject(project);

    }

    function updateStatus(projectId, status) {

        const project = getProject(projectId);

        if (!project) return;

        project.status = status;

        updateProject(project);

    }

    function updateStage(projectId, stage) {

        const project = getProject(projectId);

        if (!project) return;

        project.currentStage = stage;

        updateProject(project);

    }

    function addProduction(projectId, production) {

        const project = getProject(projectId);

        if (!project) return;

        project.productions.push(production);

        updateProject(project);

    }

    function getProductionCount(projectId) {

        const project = getProject(projectId);

        if (!project) return 0;

        return project.productions.length;

    }

    /* =====================================================
       Export
    ===================================================== */

    return {

        load,

        save,

        reset,

        uuid,

        now,

        getProjects,

        getSortedProjects,

        getProject,

        createProject,

        updateProject,

        deleteProject,

        togglePinned,

        updateStatus,

        updateStage,

        addProduction,

        getProductionCount

    };

})();
