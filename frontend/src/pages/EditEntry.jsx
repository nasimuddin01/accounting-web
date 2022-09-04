import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { GET_ENTRY_URL, EDIT_ENTRY_URL } from "../constants/api";
import Loading from "../components/Loading";

export default function EditEntry() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [helperText, setHelperText] = useState();
  const [saveButtonLabel, setSaveButtonLabel] = useState("Save");

  const [formData, setFormData] = useState({
    narration: "",
  });
  const { narration } = formData;

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    const data = {
      narration,
    };
    try {
      const response = await axios.put(`${EDIT_ENTRY_URL}${id}`, data, config);
      setHelperText("");
      setSaveButtonLabel("Saved 🎉");
      setFormData({ narration: response.data.narration });
    } catch (e) {
      setHelperText(e.response.data.error.message);
    }
    setIsLoading(false);
  };

  const getEntry = async () => {
    try {
      const response = await axios.get(`${GET_ENTRY_URL}${id}`, config);
      setHelperText("");
      setFormData({ narration: response.data.narration });
    } catch (e) {
      setHelperText(e.response.data.error.message);
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    getEntry();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Edit Entry</h1>
            </div>
            <h1 className="text-2xs font-thin break-all text-justify uppercase">
              #{id}
            </h1>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Narration</span>

                {isLoadingData ? <Loading height={4} width={4} /> : null}
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Narration"
                maxLength={200}
                onChange={onChange}
                value={narration}
                name="narration"
              ></textarea>
              <label className="label">
                <span className="label-text-alt">({narration.length}/200)</span>
              </label>
            </div>

            <p className="text-red-500 text-sm text-left">{helperText}</p>

            <div className="form-control mt-2">
              <button
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                onClick={handleSubmit}
              >
                {saveButtonLabel}
              </button>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}
