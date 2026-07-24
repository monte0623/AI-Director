/* =====================================================
   AI Director V10
   Build001-B
   Feature 1 : Dashboard
   File : project.js
===================================================== */

"use strict";

const ProjectWorkspace = (() => {

    let currentProjectId = null;

    let currentFilter = "all";

    /* =====================================================
       Initialize
    ===================================================== */

    function init() {

        bindEvents();

        renderDashboard();

    }

    /* =====================================================
       Events
    ===================================================== */

    function bindEvents() {

        document
            .getElementById("btnNewProject")
            ?.addEventListener(
                "click",
                openDialog
            );

        document
            .getElementById("btnCancel")
            ?.addEventListener(
                "click",
                closeDialog
            );

        document
            .getElementById("btnSave")
            ?.addEventListener(
                "click",
                saveProject
            );

        document
            .getElementById("btnBackDashboard")
            ?.addEventListener(
                "click",
                backDashboard
            );

        document
            .querySelectorAll(".filter-button")
            .forEach(button => {

                button.addEventListener(

                    "click",

                    () => {

                        currentFilter =
                            button.dataset.filter;

                        updateFilterButton();

                        renderDashboard();

                    }

                );

            });

    }

    /* =====================================================
       Dialog
    ===================================================== */

    function openDialog() {

        clearForm();

        Router.openDialog(
            "projectDialog"
        );

    }

    function closeDialog() {

        Router.closeDialog(
            "projectDialog"
        );

    }

    function clearForm() {

        document.getElementById(
            "projectName"
        ).value = "";

        document.getElementById(
            "clientName"
        ).value = "";

        document.getElementById(
            "brandName"
        ).value = "";

        document.getElementById(
            "projectDescription"
        ).value = "";

    }

    /* =====================================================
       Save Project
    ===================================================== */

    function saveProject() {

        const name =
            document
            .getElementById("projectName")
            .value
            .trim();

        if (!name) {

            Router.message(
                "請輸入製作案名稱"
            );

            return;

        }

        Storage.createProject({

            name,

            client:

                document
                .getElementById("clientName")
                .value
                .trim(),

            brand:

                document
                .getElementById("brandName")
                .value
                .trim(),

            description:

                document
                .getElementById("projectDescription")
                .value
                .trim()

        });

        closeDialog();

        Router.show("dashboardPage");

        renderDashboard();

    }

    /* =====================================================
       Dashboard
    ===================================================== */

    function renderDashboard() {

        const container =
            document.getElementById(
                "dashboardList"
            );

        let projects =
            Storage.getSortedProjects();

        if (currentFilter !== "all") {

            projects = projects.filter(

                project =>

                    project.status ===
                    currentFilter

            );

        }

        if (projects.length === 0) {

            container.innerHTML = `

                <div class="empty-card">

                    沒有符合條件的製作案

                </div>

            `;

            return;

        }

        container.innerHTML = "";

        projects.forEach(project => {

            container.appendChild(

                renderProjectCard(project)

            );

        });

    }
  
    /* =====================================================
       Dashboard Card
    ===================================================== */

    function renderProjectCard(project) {

        const card =
            document.createElement("div");

        card.className = "dashboard-card";

        card.dataset.id = project.id;

        const productionCount =
            Storage.getProductionCount(
                project.id
            );

        card.innerHTML = `

            <div class="status-bar status-${statusClass(project.status)}"></div>

            <div class="dashboard-card-content">

                <div class="dashboard-card-header">

                    <button
                        class="pin-button">

                        ${project.pinned ? "📌" : "📍"}

                    </button>

                    <span
                        class="status-badge status-${statusClass(project.status)}">

                        ${project.status}

                    </span>

                </div>

                <div class="dashboard-project-title">

                    ${project.name}

                </div>

                <div class="dashboard-info">

                    <span class="label">

                        客戶

                    </span>

                    <span>

                        ${project.client || "-"}

                    </span>

                </div>

                <div class="dashboard-info">

                    <span class="label">

                        目前階段

                    </span>

                    <span>

                        ${project.currentStage}

                    </span>

                </div>

                <div class="dashboard-info">

                    <span class="label">

                        製作內容

                    </span>

                    <span>

                        ${productionCount}

                    </span>

                </div>

                <div class="dashboard-update">

                    更新：

                    ${formatDate(project.updatedAt)}

                </div>

            </div>

        `;

        card
            .querySelector(".pin-button")
            .addEventListener(

                "click",

                event => {

                    event.stopPropagation();

                    Storage.togglePinned(
                        project.id
                    );

                    renderDashboard();

                }

            );

        card.addEventListener(

            "click",

            () => {

                openProject(
                    project.id
                );

            }

        );

        return card;

    }

    /* =====================================================
       Filter
    ===================================================== */

    function updateFilterButton() {

        document
            .querySelectorAll(".filter-button")
            .forEach(button => {

                button.classList.remove(
                    "active"
                );

                if (

                    button.dataset.filter ===
                    currentFilter

                ) {

                    button.classList.add(
                        "active"
                    );

                }

            });

    }

    /* =====================================================
       Project
    ===================================================== */

    function openProject(projectId) {

        currentProjectId = projectId;

        const project =
            Storage.getProject(
                projectId
            );

        if (!project) {

            return;

        }

    document.getElementById(
        "workspaceTitle"
    ).textContent =
        project.name;

    loadWorkspace(project);

    Router.show(
        "projectWorkspacePage"
    );

    }

    function backDashboard() {

        currentProjectId = null;

        Router.show(
            "dashboardPage"
        );

        renderDashboard();

    }
  
    /* =====================================================
       Workspace
    ===================================================== */

    function loadWorkspace(project) {

        document.getElementById(
            "workspaceProjectName"
        ).value = project.name;

        document.getElementById(
            "workspaceClient"
        ).value = project.client;

        document.getElementById(
            "workspaceBrand"
        ).value = project.brand;

        document.getElementById(
            "workspaceStatus"
        ).value = project.status;

        renderProductionList(project);

    }

    function renderProductionList(project) {

        const container =
            document.getElementById(
                "productionList"
            );

        if (
            project.productions.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-card">

                    尚未建立製作內容

                </div>

            `;

            return;

        }

        container.innerHTML = "";

        project.productions.forEach(

            production => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "production-item";

                item.innerHTML = `

                    <div class="production-name">

                        ${production.name}

                    </div>

                `;

                container.appendChild(item);

            }

        );

    }

    /* =====================================================
       Save Workspace
    ===================================================== */

    function saveWorkspace() {

        if (!currentProjectId) {

            return;

        }

        const project =
            Storage.getProject(
                currentProjectId
            );

        if (!project) {

            return;

        }

        project.name =
            document.getElementById(
                "workspaceProjectName"
            ).value.trim();

        project.client =
            document.getElementById(
                "workspaceClient"
            ).value.trim();

        project.brand =
            document.getElementById(
                "workspaceBrand"
            ).value.trim();

        project.status =
            document.getElementById(
                "workspaceStatus"
            ).value;

        Storage.updateProject(project);

        renderDashboard();

    }

    /* =====================================================
       Create Production
    ===================================================== */

    function createProduction() {

        if (!currentProjectId) {

            return;

        }

        const name =
            prompt(
                "請輸入製作內容名稱"
            );

        if (!name) {

            return;

        }

        Storage.addProduction(

            currentProjectId,

            {

                id: Storage.uuid(),

                name: name.trim(),

                createdAt: Storage.now(),

                updatedAt: Storage.now()

            }

        );

        const project =
            Storage.getProject(
                currentProjectId
            );

        loadWorkspace(project);

    }
  
    /* =====================================================
       Helpers
    ===================================================== */

    function statusClass(status) {

        switch (status) {

            case "進行中":
                return "running";

            case "暫停":
                return "paused";

            case "已完成":
                return "completed";

            case "已取消":
                return "cancelled";

            case "已封存":
                return "archived";

            default:
                return "running";

        }

    }

    function formatDate(dateString) {

        const date = new Date(dateString);

        return date.toLocaleString(

            "zh-TW",

            {

                year: "numeric",

                month: "2-digit",

                day: "2-digit",

                hour: "2-digit",

                minute: "2-digit"

            }

        );

    }

    /* =====================================================
       Public API
    ===================================================== */

    return {

        init,

        renderDashboard,

        openProject,

        backDashboard,

        saveWorkspace,

        createProduction

    };

})();

/* =====================================================
   Auto Initialize
===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        ProjectWorkspace.init();

    }

);
