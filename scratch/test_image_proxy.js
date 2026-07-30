async function testOne(fileId) {
  const targetUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    const isHtmlOrSignIn = response.url.includes('accounts.google.com') || (response.headers.get('content-type') || '').includes('text/html');
    console.log(`ID ${fileId}: Status ${response.status}, Is HTML/Sign-in? ${isHtmlOrSignIn}`);
  } catch (err) {
    console.error(`ID ${fileId} Error:`, err);
  }
}

async function test() {
  await testOne('1zTMkdf9BgZATMPXEmc5iXsVAWbxfc86h');
  await testOne('1Lv86_lq_1v-PbDVXoW3yhoozQgJ_CwGJ');
  await testOne('1_Pv2d5rrgO5i4mjppc9x_ZQDY1c_up2_');
}

test();
