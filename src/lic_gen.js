/**
 * Created by KSingh1 on 6/22/2015.
 */

/* Required Modules */

    var ref = require('ref');
    var ffi = require('ffi');
    var fs = require('fs');


/* Declaring Variables */

    var ptr_sntl_lic_handle = ref.refType(ref.types.int);
    var ptr_resultant_state_string = ref.refType(ref.types.int);
    var ptr2ptr_resultant_state_string = ref.refType(ptr_resultant_state_string);
    var ptr_license_string = ref.refType(ref.types.char);
    var ptr2ptr_license_string = ref.refType(ptr_license_string);
    var ptr_readable_state_string = ref.refType(ref.types.char);
    var ptr2ptr_readable_state_string = ref.refType(ptr_readable_state_string);
    var ptr_info = ref.refType(ref.types.char);
    var ptr2ptr_info = ref.refType(ptr_info);


/* Function Declarations */

    var sntl_lg_initialize = ffi.Library('./licgen_component/lib/x64/sntl_licgen_windows_x64', {'sntl_lg_initialize': ['int', ['string', ptr_sntl_lic_handle]]});
    var sntl_lg_start = ffi.Library('./licgen_component/lib/x64/sntl_licgen_windows_x64', {'sntl_lg_start': ['int', ['int', 'string', 'string', 'int', 'string', 'string']]});
    var sntl_lg_generate_license = ffi.Library('./licgen_component/lib/x64/sntl_licgen_windows_x64', {'sntl_lg_generate_license': ['int', ['int', 'string', ptr2ptr_license_string, ptr2ptr_resultant_state_string]]});
    var sntl_lg_decode_current_state = ffi.Library('./licgen_component/lib/x64/sntl_licgen_windows_x64', {'sntl_lg_decode_current_state': ['int', ['int', 'string', 'string', ptr2ptr_readable_state_string]]});
    var sntl_lg_cleanup = ffi.Library('./licgen_component/lib/x64/sntl_licgen_windows_x64', {'sntl_lg_cleanup': ['int', [ptr_sntl_lic_handle]]});
    var sntl_lg_get_info = ffi.Library('./licgen_component/lib/x64/sntl_licgen_windows_x64', {'sntl_lg_get_info': ['int', ['int', 'int', ptr2ptr_info]]});


module.exports = {

    ldk_generate_license : function(vendor_code,license_type,license_definition,current_state){
        var status;
        var init_param = null;
        var generation_param = null;
        var handle = ref.alloc(ref.types.int);
        status = sntl_lg_initialize.sntl_lg_initialize(null, handle);
        status = sntl_lg_start.sntl_lg_start(handle.deref(), init_param, vendor_code, license_type, license_definition, current_state);   /// (handle, start_param=null, vendor_code,license_type,License_definition, Current_state);
        if(status)
        {
            sntl_lg_cleanup.sntl_lg_cleanup(handle);
            return status;
        }

        var ptr_resultant_state = ref.refType(ref.refType(ref.types.char));
        var ptr_license_string = ref.refType(ref.refType(ref.types.char));
        var mylic = ref.alloc(ptr_license_string);

        status = sntl_lg_generate_license.sntl_lg_generate_license(handle.deref(), generation_param, mylic, ref.alloc(ptr_resultant_state));
        if(status)
        {
            sntl_lg_cleanup.sntl_lg_cleanup(handle);
            return status;
        }
        var lic_file = ref.readCString(mylic.deref(), 0);
        fs.writeFile("src/lic_generated.v2c", lic_file, function (err) {
            if (err) {
                return 500;
            }
        });

        status = sntl_lg_cleanup.sntl_lg_cleanup(handle);
        if(status)
        {
            sntl_lg_cleanup.sntl_lg_cleanup(handle);
            return status;
        }
        return lic_file;
    },

    ldk_decode_license : function(vendor_code, c2v ) {

        var handle = ref.alloc(ref.types.int);
        var status = sntl_lg_initialize.sntl_lg_initialize(null, handle);
        var readref = ref.alloc(ptr2ptr_readable_state_string);
        var status = sntl_lg_decode_current_state.sntl_lg_decode_current_state(handle.deref(), vendor_code, c2v, readref);
        if(status)
        {
            sntl_lg_cleanup.sntl_lg_cleanup(handle);
            return status;
        }
        if(status === 0)
        {
            return ref.readCString(readref.deref(),0);
        }

        var status = sntl_lg_cleanup.sntl_lg_cleanup(handle);
        if(status)
        {
            sntl_lg_cleanup.sntl_lg_cleanup(handle);
            return status;
        }


    },
    ldk_get_capable_devices : function(vendor_code, license_definition, current_state, license_type){
        var status;
        var init_param = null;
        var generation_param = null;
        var handle = ref.alloc(ref.types.int);
        status = sntl_lg_initialize.sntl_lg_initialize(null, handle);
        status = sntl_lg_start.sntl_lg_start(handle.deref(), init_param, vendor_code, license_type, license_definition, current_state);
        if(status)
        {
            sntl_lg_cleanup.sntl_lg_cleanup(handle);
            return status;
        }
        var info_ref_string = ref.refType(ref.refType(ref.types.char));
        var info_ref = ref.alloc(info_ref_string);
        var status = sntl_lg_get_info.sntl_lg_get_info(handle.deref(),1,info_ref);
        if(status)
        {
            sntl_lg_cleanup.sntl_lg_cleanup(handle);
            return status;
        }
        var info_deref = ref.readCString(info_ref.deref(),0);
        return info_deref;
    }


};


    var ldk_get_last_licgen_err_msg = function(arg1){
        var info_ref_string = ref.refType(ref.refType(ref.types.char));
        var info_ref = ref.alloc(info_ref_string);
        var status = sntl_lg_get_info.sntl_lg_get_info(arg1,2,info_ref);
        var info_deref = ref.readCString(info_ref.deref(),0);
        return info_deref;
};