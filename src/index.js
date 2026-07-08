const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();
const PORT = 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

hbs.registerPartials(path.join(__dirname, "partials"));

app.use(express.static(path.join(__dirname, "../public")));

const myProjects = [
  {
    title: "Personal Portfolio",
    duration: "Juni 2026",
    description:
      "Website portfolio pribadi menggunakan Express.js, Handlebars, Bootstrap, dan JavaScript.",
    image: "/assets/project1.png",
    tech: ["HTML", "CSS", "Bootstrap", "Express.js"],
  },
  {
    title: "E-Commerce Dashboard",
    duration: "Juli 2026",
    description:
      "Dashboard analytics menggunakan Express.js, Prisma ORM, PostgreSQL, dan Chart.js.",
    image: "/assets/project2.png",
    tech: ["Express", "Prisma", "PostgreSQL"],
  },
  {
    title: "Creator Analytics Hub",
    duration: "2026",
    description:
      "Mobile analytics dashboard berbasis React Native dan Express.js.",
    image: "/assets/project3.png",
    tech: ["React Native", "Expo", "Express"],
  },
];


// Route Home
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    projects: myProjects,
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
    title: "My Project",
    projects: myProjects,
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
