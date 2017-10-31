var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
router.use(bodyParser.urlencoded({ extended: true }));
var PatientProvider = require('./patientinfo');
var User=require('./User');

parseParameters = function (req) {
      var queryObj = {};
      var paramObj={
        TotalDischarges:{max:'',min:''},
        AverageCoveredCharges:{max:'',min:''},
        AverageMedicarePayments:{max:'',min:''},
        ProviderState:''
      };

        paramObj.ProviderState = req.query.state,
        paramObj.TotalDischarges.max = req.query.maxDischarges,
        paramObj.TotalDischarges.min = req.query.minDischarges,
        paramObj.AverageCoveredCharges.max = req.query.maxAvgCoveredCharges,
        paramObj.AverageCoveredCharges.min = req.query.minAvgCoveredCharges,
        paramObj.AverageMedicarePayments.max = req.query.maxAvgMedicarePayments,
        paramObj.AverageMedicarePayments.min = req.query.minAvgMedicarePayments;
    
        for(var key in paramObj)
        {   
            if(key=='ProviderState')
            {
                if(paramObj[key])
                 queryObj['ProviderState'] = paramObj[key].toUpperCase();  
            }
            else
            {
                if(paramObj[key].max && paramObj[key].min)
                    queryObj[key] = { $gte:  parse(paramObj[key].min), $lte: parse(paramObj[key].max) };
                else if (paramObj[key].max)
                    queryObj[key] = { $lte: parse(paramObj[key].max) };
                else if(paramObj[key].min)
                    queryObj[key] = { $gte:  parse(paramObj[key].min) };
            }
            
        }
    return queryObj;
}
parse = function (val) {
    if (val)
    {
        if(val=="0")
        {
            return 0;
        }
        else
        return Number(val) || undefined;
    }
    else
        return undefined;
}

// route middleware to verify a token
router.use(function(req, res, next) {
    
      // check header or url parameters or post parameters for token
      var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
      // decode token
      if (token) {
    
        // verifies secret and checks exp
        jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
          }
        });
    
      } else {
    
        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    
      }
    });

// route to find all the patients for the supplied query(GET http://localhost:3000/providers)
router.get('/', function (req, res) {
    var pageOptions = {
        page: req.headers["page"] || 0,
        limit: req.headers["limit"] || 50
    }

  

var selectedDataPoints={};
   var datapoints= req.headers['datapoints'].split("|");
   for(var i=0;i<datapoints.length;i++)
   {
        selectedDataPoints[datapoints[i]]=true;
   }
   selectedDataPoints._id=false;

    var queryObj = parseParameters(req);
   
    PatientProvider.find(queryObj,selectedDataPoints)
    .skip(pageOptions.page*pageOptions.limit)
    .limit(pageOptions.limit).exec( function (err, patientProviders) {
        PatientProvider.count(queryObj,function(error,totalCount){
            if (err) return res.status(500).send("There was a problem finding the patient providers.");
            res.status(200).send({data:patientProviders,totalCount:totalCount});
        });
       
    });
});


module.exports = router;