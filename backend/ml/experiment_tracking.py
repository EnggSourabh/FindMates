import mlflow


def log_profile_count(profile_count: int) -> None:
    try:
        mlflow.set_experiment("Hackathon Team Matcher")

        with mlflow.start_run():
            mlflow.log_metric("total_profiles", profile_count)
    except Exception:
        # MLflow should not block the product workflow during local development.
        return
