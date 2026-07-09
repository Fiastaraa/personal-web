let projects = [
  {
    id: 1,
    projectName: "Personal Web",
    startDate: "2026-07-01",
    endDate: "2026-07-20",
    description: "Website portfolio menggunakan Express dan Handlebars.",
    image: "/assets/images/project1.jpg",
    technologies: ["Node JS", "Express", "Handlebars"]
  }
];


const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();
const PORT = 3000;



app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

hbs.registerPartials(path.join(__dirname, "partials"));

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));




// Route Home
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    projects,
  });
});

// Route Contact
app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact",
  });
});

// Route My Project
app.get("/my-project", (req, res) => {
  res.render("my-project", {
    projects,
  });
});

app.post("/my-project", (req, res) => {

    const {
        projectName,
        startDate,
        endDate,
        description,
        nodejs,
        express,
        bootstrap,
        postgresql
    } = req.body;

    const technologies = [];

    if(nodejs) technologies.push("Node JS");
    if(express) technologies.push("Express");
    if(bootstrap) technologies.push("Bootstrap");
    if(postgresql) technologies.push("PostgreSQL");

    const project = {

        id: Date.now(),

        projectName,

        startDate,

        endDate,

        description,

        image: "/assets/images/default-project.jpg",

        technologies

    };

    projects.push(project);

    res.redirect("/my-project");

});

app.get("/project/:id", (req, res) => {
  const { id } = req.params;

  const project = projects.find(item => item.id == id);

  if (!project) {
    return res.redirect("/my-project");
  }

  res.render("project-detail", {
    project,
  });
});

app.get("/delete-project/:id", (req, res) => {

    const { id } = req.params;

    projects = projects.filter(item => item.id != id);

    res.redirect("/my-project");

});

app.get("/edit-project/:id", (req, res) => {
  const { id } = req.params;

  const project = projects.find(item => item.id == id);

  if (!project) {
    return res.redirect("/my-project");
  }

  res.render("edit-project", {
    project,
  });
});

app.post("/edit-project/:id", (req, res) => {
  const { id } = req.params;

  const {
    projectName,
    startDate,
    endDate,
    description,
  } = req.body;

  const project = projects.find(item => item.id == id);

  if (!project) {
    return res.redirect("/my-project");
  }

  project.projectName = projectName;
  project.startDate = startDate;
  project.endDate = endDate;
  project.description = description;

  res.redirect("/my-project");
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
