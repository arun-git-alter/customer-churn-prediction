from pathlib import Path


def main() -> None:
    project_root = Path(__file__).resolve().parent
    print(f"Churn prediction project ready at: {project_root}")


if __name__ == "__main__":
    main()
