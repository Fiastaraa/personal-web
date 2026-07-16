const pool = require("./config/db.js");

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Database connection failed:", err.stack);
  }

  console.log("Database Connected!");

  release();
});

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result.rows);
  }
});



const express = require("express");
const path = require("path");
const hbs = require("hbs");

const session=require("express-session");
const flash=require("connect-flash");

const app = express();
const PORT = 3000;



app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

hbs.registerPartials(path.join(__dirname, "partials"));

// Helper untuk menandai checkbox teknologi yang dipilih
hbs.registerHelper("isChecked", function(selectedTech, id) {
  if (!selectedTech) return "";
  // ensure types are comparable
  const ids = selectedTech.map((v) => Number(v));
  return ids.includes(Number(id)) ? "checked" : "";
});

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
      secret: "personal-web",
      resave: false,
      saveUninitialized: false,
  })
);

app.use(flash());



app.use((req,res,next)=>{

  res.locals.success=req.flash("success");

  res.locals.error=req.flash("error");

  next();

});







// Route Home
app.get("/", async (req, res) => {

  try {

        const result = await pool.query(`
          SELECT
            p.id,
            p.project_name AS "projectName",
            p.start_date AS "startDate",
            p.end_date AS "endDate",
            p.description,
            p.image,
            COALESCE(array_remove(array_agg(DISTINCT t.technology_name), NULL), '{}') AS technologies
          FROM projects p
          LEFT JOIN project_technologies pt ON p.id = pt.project_id
          LEFT JOIN technologies t ON pt.technology_id = t.id
          GROUP BY p.id
          ORDER BY p.id DESC
        `);

        // map DB arrays to plain JS arrays (pg returns JS arrays already)
        res.render("home", {
          title: "Home",
          projects: result.rows
        });

  } catch(err){

    console.error(err);

    return res.status(500).render("500",{
      message: err.message
    });

}

});



// Route Contact
app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact",
  });
});





// Route My Project
app.get("/my-project", async (req, res) => {

  try {

        const result = await pool.query(`
          SELECT
            p.id,
            p.project_name AS "projectName",
            p.start_date AS "startDate",
            p.end_date AS "endDate",
            p.description,
            p.image,
            COALESCE(array_remove(array_agg(DISTINCT t.technology_name), NULL), '{}') AS technologies
          FROM projects p
          LEFT JOIN project_technologies pt ON p.id = pt.project_id
          LEFT JOIN technologies t ON pt.technology_id = t.id
          GROUP BY p.id
          ORDER BY p.id DESC
        `);

        res.render("my-project", {
          projects: result.rows
        });

  } catch(err){

    console.error(err);

    return res.status(500).render("500",{
      message: err.message
    });

}

});


app.post("/my-project", async (req, res) => {

  try {

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

    if(!projectName ||
       !startDate ||
       !endDate ||
       !description){

        req.flash("error","Semua field wajib diisi");

        return res.redirect("/my-project");

    }

    if(description.trim().length<20){

        req.flash("error","Deskripsi minimal 20 karakter");

        return res.redirect("/my-project");

    }

    const result = await pool.query(
      `
      INSERT INTO projects
      (
        user_id,
        project_name,
        start_date,
        end_date,
        description,
        image
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING id
      `,
      [
        1,
        projectName,
        startDate,
        endDate,
        description,
        "default-project.jpg"
      ]
    );

    const projectId = result.rows[0].id;

    const technologies = [];

if (nodejs) technologies.push(9);
if (express) technologies.push(10);
if (bootstrap) technologies.push(4);
if (postgresql) technologies.push(5);

for (const techId of technologies) {

  await pool.query(
    `
    INSERT INTO project_technologies
    (project_id, technology_id)
    VALUES
    ($1,$2)
    `,
    [projectId, techId]
  );

}

    console.log("Project baru:", projectId);

    req.flash("success", "Project berhasil ditambahkan");
    return res.redirect("/my-project");

  } catch (err) {

    console.error(err);
    req.flash("error", "Gagal menambahkan project. Coba lagi nanti.");
    return res.redirect("/my-project");

  }

});


app.get("/project/:id", async (req, res) => {

  try {

      const { id } = req.params;

        const result = await pool.query(
          `
          SELECT
            p.id,
            p.project_name AS "projectName",
            p.start_date AS "startDate",
            p.end_date AS "endDate",
            p.description,
            p.image,
            COALESCE(array_remove(array_agg(DISTINCT t.technology_name), NULL), '{}') AS technologies
          FROM projects p
          LEFT JOIN project_technologies pt ON p.id = pt.project_id
          LEFT JOIN technologies t ON pt.technology_id = t.id
          WHERE p.id = $1
          GROUP BY p.id
          `,
          [id]
        );

        if (result.rows.length === 0) {
          req.flash("error", "Project tidak ditemukan");
          return res.redirect("/my-project");
        }

        // Ensure technologies is an array of strings
        const project = result.rows[0];
        project.technologies = project.technologies || [];

        res.render("project-detail", {
          project,
        });

  } catch(err){

    console.error(err);

    return res.status(500).render("500",{
      message: err.message
    });

}

});


// Route GET Edit Project
app.get("/edit-project/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const projectResult = await pool.query(
      `
      SELECT
        id,
        project_name AS "projectName",
        start_date AS "startDate",
        end_date AS "endDate",
        description,
        image
      FROM projects
      WHERE id = $1
      `,
      [id]
    );

    if (projectResult.rows.length === 0) {
      req.flash("error", "Project tidak ditemukan");
      return res.redirect("/my-project");
    }

    const techResult = await pool.query(`SELECT id, technology_name AS name FROM technologies ORDER BY id`);

    const selectedResult = await pool.query(
      `SELECT technology_id FROM project_technologies WHERE project_id = $1`,
      [id]
    );

    const selectedTech = selectedResult.rows.map((r) => r.technology_id);

    res.render("edit-project", {
      project: projectResult.rows[0],
      technologies: techResult.rows,
      selectedTech,
    });

  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal memuat data project");
    return res.redirect("/my-project");
  }

});


app.get("/delete-project/:id", async (req, res) => {

  try {

    const { id } = req.params;

    // Hapus relasi teknologi terlebih dahulu
    await pool.query(
      `
      DELETE FROM project_technologies
      WHERE project_id = $1
      `,
      [id]
    );

    // Hapus project
    await pool.query(
      `
      DELETE FROM projects
      WHERE id = $1
      `,
      [id]
    );

    req.flash("success", "Project berhasil dihapus");
    return res.redirect("/my-project");

  } catch (err) {

    console.error(err);
    req.flash("error", "Gagal menghapus project. Coba lagi nanti.");
    return res.redirect("/my-project");

  }

});


app.post("/edit-project/:id", async (req,res)=>{

  const { id } = req.params;

  const {
      projectName,
      startDate,
      endDate,
      description,
      technologies
  } = req.body;

  try{

      // Server-side validation
      if(!projectName || !startDate || !endDate || !description){

        req.flash("error","Semua field wajib diisi");
        return res.redirect(`/edit-project/${id}`);

      }

      if(description.trim().length < 20){

        req.flash("error","Deskripsi minimal 20 karakter");
        return res.redirect(`/edit-project/${id}`);

      }

      await pool.query(`
          UPDATE projects
          SET
              project_name=$1,
              start_date=$2,
              end_date=$3,
              description=$4
          WHERE id=$5
      `,[
          projectName,
          startDate,
          endDate,
          description,
          id
      ]);

      await pool.query(`
          DELETE FROM project_technologies
          WHERE project_id=$1
      `,[id]);

      if(technologies){

          const techArray = Array.isArray(technologies)
              ? technologies
              : [technologies];

          for(const techId of techArray){

              await pool.query(`
                  INSERT INTO project_technologies
                  (project_id,technology_id)
                  VALUES($1,$2)
              `,[id,techId]);

          }

      }

      req.flash("success","Project berhasil diubah");
      return res.redirect("/my-project");

    }catch(err){

      console.error(err);
      req.flash("error","Gagal mengubah project. Coba lagi nanti.");
      return res.redirect("/my-project");

    }

});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
