/* ==========================================
   AI Director V10
   Build001-A
   project.js
========================================== */

const ProjectWorkspace = (() => {

    let currentProjectId = null;

    /* ==========================
       Initialize
    ========================== */

    function init() {

        bindEvents();

        renderProjects();

    }

    /* ==========================
       Events
    ========================== */

    function bindEvents() {

        document
            .getElementById("btnNewProject")
            ?.addEventListener("click", openDialog);

        document
            .getElementById("btnCancel")
            ?.addEventListener("click", closeDialog);

        document
            .getElementById("btnSave")
            ?.addEventListener("click", saveProject);

    }

    /* ==========================
       Dialog
    ========================== */

    function openDialog() {

        clearForm();

        Router.openDialog("projectDialog");

    }

    function closeDialog() {

        Router.closeDialog("projectDialog");

    }

    /* ==========================
       Form
    ========================== */

    function clearForm() {

        document.getElementById("projectName").value = "";
        document.getElementById("clientName").value = "";
        document.getElementById("brandName").value = "";
        document.getElementById("projectDescription").value = "";

    }

    /* ==========================
       Save
    ========================== */

    function saveProject() {

        const name =
            document.getElementById("projectName").value.trim();

        if (name === "") {

            Router.message("請輸入製作案名稱");

            return;

        }

        Storage.createProject({

            name,

            client:
                document.getElementById("clientName").value.trim(),

            brand:
                document.getElementById("brandName").value.trim(),

            description:
                document.getElementById("projectDescription").value.trim()

        });

        closeDialog();

        renderProjects();

    }

    /* ==========================
       Render
    ========================== */

    function renderProjects() {

        const container =
            document.getElementById("projectList");

        const projects =
            Storage.getProjects();

        if (projects.length === 0) {

            container.innerHTML = `

                <div class="empty-card">

                    目前尚無製作案

                </div>

            `;

            return;

        }

        container.innerHTML = "";

        projects.forEach(project => {

            const card = document.createElement("div");

            card.className = "project-card";

            card.innerHTML = `

                <div class="project-title">

                    ${project.name}

                </div>

                <div class="project-info">

                    <div class="project-label">客戶</div>

                    <div class="project-value">

                        ${project.client || "-"}

                    </div>

                    <div class="project-label">品牌</div>

                    <div class="project-value">

                        ${project.brand || "-"}

                    </div>

                </div>

                <div class="project-footer">

                    <div class="project-date">

                        ${formatDate(project.createdAt)}

                    </div>

                    <div class="project-status">

                        進行中

                    </div>

                </div>

            `;

            card.addEventListener("click", () => {

                openProject(project.id);

            });

            container.appendChild(card);

        });

    }

    /* ==========================
       Open Project
    ========================== */

    function openProject(projectId) {

        currentProjectId = projectId;

        console.log(

            "Open Project:",

            Storage.getProject(projectId)

        );

        Router.message("下一個 Build 建立製作案工作區");

    }

    /* ==========================
       Delete
    ========================== */

    function deleteProject(projectId) {

        if (!Router.confirmBox("確定刪除製作案？")) {

            return;

        }

        Storage.deleteProject(projectId);

        renderProjects();

    }

    /* ==========================
       Helpers
    ========================== */

    function formatDate(dateString) {

        const date = new Date(dateString);

        return date.toLocaleDateString("zh-TW");

    }

    /* ==========================
       Public API
    ========================== */

    return {

        init,

        renderProjects,

        deleteProject,

        openProject,

        getCurrentProject() {

            return currentProjectId;

        }

    };

})();
