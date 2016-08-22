package com.example.model;

/**
 * Created by Li on 2016/6/8.
 */
public class Result {
    protected String action;
    protected boolean success;
    protected String errorMessage;
    public Result(String action, boolean success, String errorMessage){
        this.action = action;
        this.success = success;
        this.errorMessage = errorMessage;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage + '\n';
    }

    // success marker will be change to false in this function.
    public void appendErrorMessage(String errorMessage){
        this.success = false;
        this.errorMessage += errorMessage + '\n';
    }

    // success marker may change due to the new result.
    public Result mergeResult(Result result){
        if(!this.action.equals(result.getAction())){
            return null;
        }
        this.success = this.success && result.isSuccess();
        if(result.success == false){
            this.appendErrorMessage(result.getErrorMessage());
        }

        return this;
    }
}