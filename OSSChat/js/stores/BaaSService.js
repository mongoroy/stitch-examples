const APP_ID = 'snapdemo-olnby'
export default class StitchService {
  static async create({ StitchClient }) {
    const stitchClient = new StitchClient(APP_ID);
    const mongoClient = stitchClient.service('mongodb', 'mongodb1');

    const instance = new StitchService();
    instance.stitchClient = stitchClient;
    instance.mongoClient = mongoClient;

    await instance.createViewer();

    return instance;
  }

  createViewer() {
    this.viewer = this.stitchClient.auth();
    if (!this.viewer) {
      return this.stitchClient.authManager.anonymousAuth().then(
        ()=> {
          this.viewer = this.stitchClient.auth();
        }
      );
    }
  }

  getDb() {
    return this.mongoClient.db('osschat');
  }
}
