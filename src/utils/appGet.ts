import { App } from "../models/app.model";

export const App_get = async (
    name: string, user: string) => {
    let app = await App.findOne({ app_name: name, createdBy: user });
    if (!app) {
        return
    }
    return app._id;


};
