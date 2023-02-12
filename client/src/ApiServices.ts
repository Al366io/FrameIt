export function generateRandomString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const { REACT_APP_BACKEND_HOST, REACT_APP_CLOUDINARY_UPLOAD_STRING } = process.env;

export async function createOwner(email: string) {
  try {
    const data = {
      email,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${REACT_APP_BACKEND_HOST}/users/owner`,
      options
    );
    if (!response.ok) {
      throw new Error('Error fetching pics for given party');
    }
    return 1;
  } catch (error) {
    console.error('Error:', error);
    return 0;
  }
}

// Dont catch error here since this fuction i used by React Query
// https://react-query-v3.tanstack.com/guides/query-functions

export async function fetchPicsFromParty(partyId: string) {
  const response = await fetch(
    `${REACT_APP_BACKEND_HOST}/party/pics/${partyId}`
  );
  if (!response.ok) {
    throw new Error('Error fetching pics for given party');
  }
  const pic = await response.json();
  return pic;
}

export async function createParty(email: string) {
  try {
    const data = {
      email: email,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${REACT_APP_BACKEND_HOST}/users/party/create`,
      options
    );
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function checkForParty(email: string) {
  try {
    const response = await fetch(
      `${REACT_APP_BACKEND_HOST}/users/info/party/${email}`
    );
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export async function deleteParty(id: string) {
  try {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    };
    const response = await fetch(`${REACT_APP_BACKEND_HOST}/party`, options);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function sendImage(data: Blob) {
  try {
    const formData = new FormData();
    formData.append('file', data, generateRandomString(10));
    formData.append('upload_preset', 'enge1fht');


    const response = await fetch(
      REACT_APP_CLOUDINARY_UPLOAD_STRING!,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const cloudinaryResult = await response.json();
    return cloudinaryResult.secure_url;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function sendUrlToDb(url: string, partyId: string) {
  try {
    const data = {
      url,
      partyId,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `${REACT_APP_BACKEND_HOST}/party/upload`,
      options
    );
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export async function getSocketRoomId(id: string) {
  try {
    const response = await fetch(
      `${REACT_APP_BACKEND_HOST}/party/socketRoom/${id}`
    );
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
}

export async function checkRoom(id: string) {
  try {
    const response = await fetch(`${REACT_APP_BACKEND_HOST}/party/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
