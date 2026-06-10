const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
const HUBSPOT_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const CUSTOM_OBJECT_ID = process.env.HUBSPOT_CUSTOM_OBJECT_ID;

app.set("view engine", "pug");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const hubspotHeaders = {
  Authorization: `Bearer ${HUBSPOT_TOKEN}`,
  "Content-Type": "application/json",
};

// Homepage - lista os registros do custom object
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=name,modelo,status`,
      {
        headers: hubspotHeaders,
      }
    );

    res.render("homepage", {
      title: "Equipamentos | Integrating With HubSpot I Practicum",
      records: response.data.results,
    });
  } catch (error) {
    console.error("Erro ao buscar registros:", error.response?.data || error.message);
    res.status(500).send("Erro ao buscar registros do HubSpot.");
  }
});

// Formulário para criar novo registro
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// Envia dados do formulário para o HubSpot
app.post("/update-cobj", async (req, res) => {
  try {
    const { name, modelo, status } = req.body;

    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`,
      {
        properties: {
          name: name,
          modelo: modelo,
          status: status,
        },
      },
      {
        headers: hubspotHeaders,
      }
    );

    res.redirect("/");
  } catch (error) {
    console.error("Erro ao criar registro:", error.response?.data || error.message);
    res.status(500).send("Erro ao criar registro no HubSpot.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});