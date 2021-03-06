import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import NavBar from "../../NavBar/NavBar";
import { useSelector, useDispatch } from "react-redux";
import { fetchDataPollAction, updatePollAction } from "./reducer";

const useStyles = makeStyles((theme) => ({
  formStyle: {
    backgroundColor: "#ecf5fd",
    margin: "auto",
    width: "80%",
    padding: "0 15px",
    borderRadius: "2.5rem",
    boxShadow: "0 5px 15px rgb(0,0,0,0.2)",
  },
}));

const schema = yup.object().shape({
  title: yup
    .string()
    .max(80, "Poll Name must be less than 80 characters.")
    .required("This is required field."),
  question: yup
    .string()
    .max(255, "Poll Question must be less than 255 characters.")
    .required("This is required field."),
  description: yup
    .string()
    .max(999, "Description must be less than 999 characters.")
    .required("This is required field."),
});

function PollDetail() {
  const fields = ["title", "question", "description", "openedAt", "closedAt"];
  const classes = useStyles();
  const params = useParams();
  const dispatch = useDispatch();
  const dataPoll = useSelector((state) => state.polldetail.dataPoll);
  console.log(dataPoll);

  const formatDate = (second, format) => {
    let time = new Date(second * 1000);
    let day = String(time.getDate()).padStart(2, "0");
    let month = String(time.getMonth() + 1).padStart(2, "0");
    let year = time.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    dispatch(updatePollAction({ data, pollId: params.pollId }));
  };

  useEffect(() => {
    fields.forEach((field) => {
      if (field === "openedAt" || field === "closedAt") {
        setValue(field, formatDate(dataPoll[field], { format: "YYYY-MM-DD" }));
      } else setValue(field, dataPoll[field] ? dataPoll[field] : "");
    });
  }, [dataPoll]);

  useEffect(() => {
    if (params.pollId) {
      dispatch(fetchDataPollAction(params.pollId));
    }
  }, []);
  return (
    <React.Fragment>
      <NavBar />
      <div className={classes.formStyle}>
        <form className="col-xl-12" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-left text-dark my-5">Poll Detail Form</h1>
          <div className="col-xl-12">
            <label htmlFor="pollName">Poll Name*</label>
            <input
              type="text"
              className="form-control col-xl-12"
              id="pollName"
              control={control}
              aria-describedby="pollName"
              {...register("title")}
            />
            <div>
              <small
                style={{ float: "right" }}
                id="pollName"
                className="form-text text-muted text-right"
              >
                Max 80 characters
              </small>
              <p style={{ color: "red" }}>{errors.title?.message}</p>
            </div>
          </div>
          <div className="col-lg-12">
            <label htmlFor="pollQuestion">Poll Question*</label>
            <input
              name="question"
              type="text"
              className="form-control"
              id="pollQuestion"
              aria-describedby="pollQ"
              {...register("question")}
            />
            <div>
              <small
                style={{ float: "right" }}
                id="pollQ"
                className="form-text text-muted text-right"
              >
                Max 255 characters
              </small>
              <p style={{ color: "red" }}>{errors.question?.message}</p>
            </div>
          </div>
          <div className="col-lg-12">
            <label htmlFor="exampleFormControlTextarea1">Description*</label>
            <textarea
              name="description"
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="10"
              {...register("description")}
            ></textarea>
            <div>
              <small
                style={{ float: "right" }}
                id="pollName"
                className="form-text text-muted text-right"
              >
                Max 999 characters
              </small>
              <p style={{ color: "red" }}>{errors.description?.message}</p>
            </div>
          </div>
          <div className="row my-4 col-xl-12 d-flex justify-content-start ">
            <div className="col-lg-5 ">
              <label htmlFor="pollOpenedAt" className="mr-2">
                From:
              </label>
              <TextField
                name="openedAt"
                id="date"
                label=""
                type="date"
                sx={{ width: "13em", height: "1em" }}
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("openedAt")}
              />
            </div>
            <div className="col-lg-5 ">
              <label htmlFor="pollClosedAt" className="mr-2">
                To:{" "}
              </label>
              <TextField
                name="closedAt"
                id="date"
                label=""
                type="date"
                sx={{ width: "13em", height: "1em" }}
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("closedAt")}
              />
            </div>
          </div>
          <div className="row col-xl-12 my-4 d-flex justify-content-between ">
            <div className="">
              <button
                type="submit"
                style={{ color: "white", width: "17%", float: "right" }}
                className="b col-lg-12 col-sm-2 btn btn-warning mt-3"
                onClick={onSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}
export default PollDetail;
