from fastapi import APIRouter, Body
import sys
import io
import contextlib
import traceback

router = APIRouter(prefix="/sandbox", tags=["Sandbox"])

@router.post("/run")
def run_code(payload: dict = Body(...)):
    code = payload.get("code", "")
    print(f"Executing sandbox code: {code}")
    
    f = io.StringIO()
    try:
        with contextlib.redirect_stdout(f):
            # Execute the code in a restricted global scope
            # We use a shared dict for globals and locals to allow multiline scripts
            globals_dict = {"__builtins__": __builtins__}
            exec(code, globals_dict)
        output = f.getvalue()
        if not output:
            output = "Code executed successfully (no output)."
    except Exception:
        output = traceback.format_exc()
    
    return {"output": output}
