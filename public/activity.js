var connection = new Postmonger.Session();

const activityJson = {
  name: '',
  id: null,
  key: 'REST-1',
  arguments: {
    execute: {
      inArguments: [
        {
          contactKey: '{{Contact.Key}}',
        },
        {
          FirstName: '{{Contact.Attribute.TestDataByGupshup.FirstName}}',
        },
        {
          LastName: '{{Contact.Attribute.TestDataByGupshup.LastName}}',
        },
      ],
      url: 'https://myappjsacti.herokuapp.com/sendMessage?user_id=2000203297&password=qFx2dPXV&phone_number={{Contact.Attribute.TestDataByGupshup.Mobile}}&message=Welcome%20to%20Gupshup.%20Click%20on%20the%20link%20below%20to%20continue%20https%3A%2F%2Fwww.gupshup.io%2Fdeveloper%2Fhome',
    },
  },
  configurationArguments: {
    publish: {
      url: 'https://myappjsacti.herokuapp.com/sfmcapp/sendMessage?user_id=2000203297&password=qFx2dPXV&phone_number={{Contact.Attribute.TestDataByGupshup.Mobile}}&message=Welcome%20to%20Gupshup.%20Click%20on%20the%20link%20below%20to%20continue%20https%3A%2F%2Fwww.gupshup.io%2Fdeveloper%2Fhome',
    },
  },
  metaData: {
    icon: 'https://sample-activity.herokuapp.com/icon.png',
    category: 'message',
    iconSmall: null,
    original_icon: 'icon.png',
    isConfigured: true,
  },
  editable: true,
  outcomes: [
    {
      next: 'WAITBYDURATION-1',
    },
  ],
  errors: [],
};

jQuery('#step2').hide();

jQuery('#toggleNextStep').click(function () {
  getApprovedTemplates();
  jQuery('#step1').hide();
  jQuery('#step2').show();
});

// getApprovedTemplates();

// Startup Sequence
connection.trigger('ready');

connection.on('initActivity', function (data) {
  //document.getElementById( 'configuration' ).value = JSON.stringify(activityJson, null, 2 );
});

// Save Sequence
connection.on('clickedNext', function () {
  var configuration = activityJson; //JSON.parse( document.getElementById( 'configuration' ).value );
  connection.trigger('updateActivity', configuration);
});

function getApprovedTemplates() {
  var endpoint = 'getTemplates';
  const username = jQuery('input[name="username"]').val();
  const password = jQuery('input[name="password"]').val();
  const options = {
    headers: { 'Access-Control-Allow-Origin': 'POST' },
  };
  const params = { username: username, password: password };
  axios.get(endpoint, { params: params }, options).then(
    (response) => {
      console.log(response.data.data);
      jQuery(
        '<h4 style="text-align: center;">Select your approved SMS template message :</h4><hr/>'
      ).appendTo('#step2');
      var templates = response.data.data;
      templates = templates.filter(
        (o) => o.type == 'TEXT' && o.status == 'ENABLED'
      );
      for (i = 0; i < templates.length; i++) {
        let text = templates[i].body;
        text = decodeURIComponent(text.replace(/\+/g, ' '));
        var radioBtn = jQuery(
          `<input style="cursor: pointer;" type="radio" name="msg_template"   value="${text.replaceAll(
            '>',
            '&gt; '
          )}"/> <span for="html" class="radio">${text}</span><br></br>`
        );
        radioBtn.appendTo('#step2');
      }

      jQuery(
        ' <div style="text-align: center"><button id="save" class"buttontag" onClick="save()">Save</button></div>'
      ).appendTo('#step2');
    },
    (error) => {
      console.log(error);
    }
  );
}

function save() {
  const msg_template = jQuery('input[name="msg_template"]:checked').val();
  const username = jQuery('input[name="username"]').val();
  const password = jQuery('input[name="password"]').val();
  //const url =  "https://media.smsgupshup.com/GatewayAPI/rest?method=SendMessage&format=json&userid="+username+"&password="+password+"&send_to={{Contact.Attribute.TestDataByGupshup.Mobile}}&v=1.1&auth_scheme=plain&msg_type=HSM&msg="+msg_template+"";

  // const url = `${enterpriseApi}rest?method=SendMessage&format=json&userid=${username}&password=${password}&send_to={{Contact.Attribute.TestDataByGupshup.Mobile}}&v=1.1&auth_scheme=plain&msg_type=HSM&msg=${encodeURIComponent(
  //   msg_template
  // )}`;

  // const local_url = `http://localhost:5000/integrations-service-10ecc/us-central1/sfmcapp/sendMessage?user_id=${username}&password=${password}&phone_number={{Contact.Attribute.TestDataByGupshup.Mobile}}&message=${encodeURIComponent(
  //   msg_template
  // )}`;

  const url = `https://myappjsacti.herokuapp.com/sendMessage?user_id=${username}&password=${password}&phone_number={{Contact.Attribute.TestDataByGupshup.Mobile}}&message=${encodeURIComponent(
    msg_template
  )}`;

  activityJson['arguments'].execute.url = url;
  activityJson['configurationArguments'].publish = { url: url };

  console.log(activityJson);

  connection.trigger('updateActivity', activityJson);
}
