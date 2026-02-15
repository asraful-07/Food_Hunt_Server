import app from "./app.js";
import { envVars } from "./app/config/env.js";

const PROT = envVars.PORT;

const bootstrap = () => {
  try {
    app.listen(PROT, () => {
      console.log(`Server on running ${PROT}`);
    });
  } catch (err: any) {
    console.error("Failed to start server:", err);
  }
};

bootstrap();
