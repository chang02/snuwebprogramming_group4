import firebase from './firebase';

const db = firebase.firestore();

const getDiaryByDate = async (uid, date) => {
  const start = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-1`);
  const end = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-31`);
  const result = await db.collection('schedule')
  .where('date', '>=', start)
  .where('date', '<=', end)
  .where('uid', '==', uid)
  .get();
  if (!result.empty) {
    return result.docs.map((element) => {
      const data = element.data();
      data.id = element.id;
      return data;
    });
  }
  return null;
}
const addDiary = async (uid, date, content) => {
  await db.collection('schedule').add({
    uid,
    date,
    content,
  });
}

const deleteDiary = async (docId) => {
  await db.collection('selfie').doc(docId).delete();
}

const getScheduleByMonth = async (uid, date) => {
  const start = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-1`);
  const end = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-31`);
  const result = await db.collection('schedule')
  .where('date', '>=', start)
  .where('date', '<=', end)
  .where('uid', '==', uid)
  .get();
  if (!result.empty) {
    return result.docs.map((element) => {
      const data = element.data();
      data.id = element.id;
      return data;
    });
  }
  return null;
}

const getScheduleByDate = async (uid, date) => {
  const result = await db.collection('schedule')
  .where('date', '==', date)
  .where('uid', '==', uid)
  .get();
  if (!result.empty) {
    return result.docs.map((element) => {
      const data = element.data();
      data.id = element.id;
      return data;
    });
  }
  return null;
}

const addSchedule = async (uid, date, content) => {
  await db.collection('schedule').add({
    uid,
    date,
    content,
  });
}

const deleteSchedule = async (docId) => {
  await db.collection('schedule').doc(docId).delete();
}

const getSelfieByDate = async (uid, date) => {
  const result = await db.collection('selfie')
  .where('date', '==', date)
  .where('uid', '==', uid)
  .get();
  if (!result.empty) {
    return result.docs.map((element) => {
      const data = element.data();
      data.id = element.id;
      return data;
    });
  }
  return null;
}

const addSelfie = async (uid, date, file, face) => {
  const ref = firebase.storage().ref();
  const task = ref.child(`${uid}/selfie/${file.name}`).put(file, { contentType: file.type });
  const snapshot = await task;
  const url = await snapshot.ref.getDownloadURL();
  await db.collection('selfie').add({
    uid,
    date,
    imageName: file.name,
    imageUrl: url,
    face,
  });
}

const deleteSelfie = async (uid, imageName, docId) => {
  const ref = firebase.storage().ref();
  const fileRef = ref.child(`${uid}/selfie/${imageName}`);
  fileRef.delete().then(async () => {
    await db.collection('selfie').doc(docId).delete();
  })
}

export default {
  getDiaryByDate,
  addDiary,
  deleteDiary,

  getScheduleByMonth,
  getScheduleByDate,
  addSchedule,
  deleteSchedule,

  getSelfieByDate,
  addSelfie,
  deleteSelfie,
}