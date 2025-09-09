import cors from "cors";

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "https://onlinerestaurantreservation.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
