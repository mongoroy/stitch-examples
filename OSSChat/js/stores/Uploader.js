import { observable, computed, action } from 'mobx';
import uploadAsset from './uploadAsset';
import FeedItem from './FeedItem';

export default class Uploader {
  stitch;

  @observable localAsset;
  @observable uploading = false;

  @action setLocalAsset({ path, isVideo }) {
    this.localAsset = {
      path,
      isVideo,
      groups: observable.map(),
      @computed get hasSelectedGroups() {
        return this.groups.size > 0;
      },
    };
  }

  @computed get hasLocalAsset() {
    return this.localAsset && this.localAsset.path;
  }

  @action clearLocalAsset() {
    this.localAsset = null;
  }

  @action toggleGroup({ id }) {
    if (this.localAsset.groups.has(id.toString())) {
      this.localAsset.groups.delete(id.toString());
    } else {
      this.localAsset.groups.set(id.toString(), true);
    }
  }

  @action async upload() {
    this.uploading = true;

    const { path, isVideo, groups } = this.localAsset;

    let remoteUrl;
    try {
      remoteUrl = await uploadAsset({
        stitchClient: this.stitch.stitchClient,
        localPath: path,
        isVideo,
      });
    } catch (e) {
      this.uploading = false;
      throw e;
    }

    const feedItem = FeedItem.createLocal({ path, isVideo, stitch: this.stitch });

    feedItem.media.url = decodeURIComponent(remoteUrl);

    const insertData = {
      ...feedItem.toJSON(),
      groups: groups.keys(),
      owner_id: '%%user.id',
    };

    const db = this.stitch.getDb();

    let response;
    try {
      response = await db.collection('items').insert([insertData]);
    } catch (e) {
      this.uploading = false;
      throw e;
    }

    feedItem.ownerId = this.stitch.stitchClient.auth()._id

    this.clearLocalAsset();
    this.uploading = false;

    return feedItem;
  }
}
