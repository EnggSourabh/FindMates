import os


EXPERIMENT_NAME = "Hackathon Team Matcher"


def _configure_mlflow():
    import mlflow

    tracking_uri = os.getenv("MLFLOW_TRACKING_URI")
    if tracking_uri:
        mlflow.set_tracking_uri(tracking_uri)

    mlflow.set_experiment(EXPERIMENT_NAME)
    return mlflow


def log_profile_count(profile_count: int) -> None:
    try:
        mlflow = _configure_mlflow()

        with mlflow.start_run():
            mlflow.log_metric("total_profiles", profile_count)
    except Exception:
        # MLflow should not block the product workflow during local development.
        return


def log_team_generation(team_count: int, member_count: int, average_chemistry: int) -> None:
    try:
        mlflow = _configure_mlflow()

        with mlflow.start_run():
            mlflow.log_metric("generated_teams", team_count)
            mlflow.log_metric("assigned_members", member_count)
            mlflow.log_metric("average_chemistry", average_chemistry)
    except Exception:
        return


def get_tracking_status() -> dict:
    try:
        mlflow = _configure_mlflow()
        return {
            "enabled": True,
            "experiment": EXPERIMENT_NAME,
            "tracking_uri": mlflow.get_tracking_uri(),
        }
    except Exception:
        return {
            "enabled": False,
            "experiment": EXPERIMENT_NAME,
            "tracking_uri": os.getenv("MLFLOW_TRACKING_URI", "local mlruns"),
        }
