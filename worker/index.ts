// redis server
import { createClient } from "redis";

export const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.connect().then(async () => {
  while (true) {

    const response = await redisClient.rPop("problems");
    if(!response){
        await new Promise((resolve) => setTimeout(resolve , 1000));
        continue;
    }

    const parsedResponse = JSON.parse(response);
    const code = parsedResponse.code;
    const language = parsedResponse.language;

    console.log("proceescing the code for user.... " + parsedResponse.userId);

    if(language === "java"){
        console.log("running the code in java");
        await new Promise ((resolve) => setTimeout(resolve,10000));
        console.log("Complied Successfully");
    }
    if(language === "javascript"){
        console.log("running the code in JS");
        await new Promise ((resolve) => setTimeout(resolve,2000));
        console.log("Complied Successfully");

    }
    if(language === "cpp"){
        console.log("running the code in Cpp");
        await new Promise ((resolve) => setTimeout(resolve,5000));
        console.log("Complied Successfully");

    }

    // update the status in the DB


  }
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});
