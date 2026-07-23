/* ==========================================
   AI Director V10
   Build001-A
   storage.js
========================================== */

const Storage = (() => {

    const STORAGE_KEY = "AI_DIRECTOR_V10";

    /* ==========================
       Default Data
    ========================== */

    const defaultData = {

        version: "10.0.0",

        projects: []

    };

    /* ==========================
       Load
    ========================== */

    function load() {

        try {

            const raw = localStorage.getItem(STORAGE_KEY);

            if (!raw) {

                save(defaultData);

                return structuredClone(defaultData);

            }

            return JSON.parse(raw);

        } catch (error) {

            console.error("Storage Load Error", error);

            return structuredClone(defaultData);

        }

    }

    /* ==========================
       Save
    ========================== */

    function save(data) {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(data)

        );

    }

    /* ==========================
       Reset
    ========================== */

    function reset() {

        localStorage.removeItem(STORAGE_KEY);

        save(defaultData);

    }

    /* ==========================
       UUID
    ========================== */

    function uuid() {

        return crypto.randomUUID();

    }

    /* ==========================
       DateTime
    ========================== */

    function now() {

        return new Date().toISOString();

    }

    /* ==========================
       Get Projects
    ========================== */

    function getProjects() {

        return load().projects;

    }

    /* ==========================
       Create Project
    ========================== */

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

            createdAt: now(),

            updatedAt: now(),

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

            productions: []

        };

        db.projects.push(project);

        save(db);

        return project;

    }

    /* ==========================
       Update Project
    ========================== */

    function updateProject(project) {

        const db = load();

        const index = db.projects.findIndex(

            p => p.id === project.id

        );

        if (index === -1) return;

        project.updatedAt = now();

        db.projects[index] = project;

        save(db);

    }

    /* ==========================
       Delete Project
    ========================== */

    function deleteProject(id) {

        const db = load();

        db.projects = db.projects.filter(

            p => p.id !== id

        );

        save(db);

    }

    /* ==========================
       Get Project
    ========================== */

    function getProject(id) {

        return getProjects().find(

            p => p.id === id

        );

    }

    /* ==========================
       Public API
    ========================== */

    return {

        load,

        save,

        reset,

        uuid,

        now,

        getProjects,

        getProject,

        createProject,

        updateProject,

        deleteProject

    };

})();
